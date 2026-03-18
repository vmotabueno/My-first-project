import { CurlyFunction, CurlyOptions } from "node-libcurl/dist/curly";
import type Iperfumeprovider = require("../interface/Iperfumeprovider");
import { tmpFilesPath } from "../../../config/paths/tmpFilePath";
import { CurlProxy } from "node-libcurl";
import { httpHeader } from "../../../config/curl/httpHeader";
import { join } from "node:path";
import { curly } from "node-libcurl";
import { decode } from "iconv-lite";


export class perfumeprovider implements Iperfumeprovider.Iperfumeprovider {
  private curl: CurlyFunction;


  constructor() {
    this.startCurl();
  }

  private startCurl() {
    const cookiePath = join(tmpFilesPath, 'trf5-cookie');

    const curlOptions: CurlyOptions = {
      curlyResponseBodyParser: (data, headers) => {
        const headersString = JSON.stringify(headers);

        if (headersString.includes('text/html')) {
          return decode(data, 'UTF-8');
        }

        return data;
      },

      cookieFile: cookiePath,
      cookieJar: cookiePath,
      SSL_VERIFYPEER: false,
      HTTPHEADER: httpHeader,
    };

    if (process.env.NODE_ENV === 'prod') {
      Object.assign(curlOptions, {
        proxy: process.env.PROXY_HOST,
        proxyUsername: `${process.env.PROXY_USER}`,
        proxyType: CurlProxy.Http,
        proxyPassword: process.env.PROXY_PASSWORD,
        proxyPort: process.env.PROXY_PORT,
      });
    }

    this.curl = curly.create(curlOptions);
  }
  async getPerfume(): Promise<void> {
    const homepage = await this.curl.get(
      'https://www.fragrantica.com.br/desenhista/'
    );
    console.log(homepage.data);
  }
}