import { perfumeprovider } from "./modules/providers/implematation/perfumeprovider";

const perfumeProvider = new perfumeprovider();
async function main() {
  const resultado = await perfumeProvider.getPerfume();
  console.log(resultado);
}
main();