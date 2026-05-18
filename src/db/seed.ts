import { db } from "./index";
import { products } from "./schema";

const seedProducts = [
  {
    slug: "refrigerador-samsung-no-frost-400l",
    title: "Refrigerador Samsung No Frost 400L",
    description:
      "Refrigerador en excelente estado, 3 años de uso. No frost, cajón de verduras, congelador grande. Tiene algunos rayones en la parte de atrás pero el resto impecable. Cabe todo lo que quieras.",
    price_clp: 350000,
    condition: "usado" as const,
    status: "disponible" as const,
    category: "electrodomésticos",
    image_urls: [] as string[],
  },
  {
    slug: "cama-2-plazas-sommier-colchon",
    title: "Cama 2 Plazas con Sommier y Colchón",
    description:
      "Cama 2 plazas con sommier y colchón Sealy incluido. Super cómoda, nos da mucha pena dejarla. 5 años de uso pero el colchón está en perfectas condiciones. Incluye 2 veladores a juego.",
    price_clp: 280000,
    condition: "usado" as const,
    status: "disponible" as const,
    category: "dormitorio",
    image_urls: [] as string[],
  },
  {
    slug: "sillon-reclinable-gris-electrico",
    title: "Sillón Reclinable Gris Eléctrico",
    description:
      "Sillón reclinable eléctrico, gris, 2 plazas. El lujo de nuestra vida. Recline automático con botón, porta vasos en los laterales. Está como nuevo, lo compramos hace 1 año.",
    price_clp: 420000,
    condition: "usado" as const,
    status: "disponible" as const,
    category: "living",
    image_urls: [] as string[],
  },
  {
    slug: "lote-ropa-mujer-talla-s-m",
    title: "Lote Ropa Mujer Talla S/M",
    description:
      "Bolsón enorme de ropa de mujer, tallas S y M. Camisas, blusas, vestidos, jeans. Todo en buen estado. Precio es por el lote completo, aprox 30 prendas.",
    price_clp: 25000,
    condition: "usado" as const,
    status: "disponible" as const,
    category: "ropa",
    image_urls: [] as string[],
  },
  {
    slug: "lote-ropa-hombre-talla-m-l",
    title: "Lote Ropa Hombre Talla M/L",
    description:
      "Ropa de hombre, tallas M y L. Poleras, camisas, pantalones, polerón. Todas las prendas en buen estado. Aprox 25 prendas en el lote.",
    price_clp: 20000,
    condition: "muy_usado" as const,
    status: "disponible" as const,
    category: "ropa",
    image_urls: [] as string[],
  },
  {
    slug: "smart-tv-55-4k-lg",
    title: 'Smart TV 55" 4K LG',
    description:
      "Televisor LG 55 pulgadas 4K, Smart TV con WebOS. Netflix, YouTube, todo. 2 años de uso, imagen perfecta. Control remoto incluido. Pantalla sin rayones.",
    price_clp: 480000,
    condition: "usado" as const,
    status: "vendido" as const,
    category: "electrónica",
    image_urls: [] as string[],
    sold_at: new Date(),
  },
  {
    slug: "mesa-comedor-6-personas-sillas",
    title: "Mesa Comedor 6 Personas + Sillas",
    description:
      "Mesa de comedor rectangular de madera, con 6 sillas tapizadas en gris. Mesa en madera maciza, algunas marcas de uso pero nada grave. Las sillas todas impecables.",
    price_clp: 320000,
    condition: "usado" as const,
    status: "disponible" as const,
    category: "comedor",
    image_urls: [] as string[],
  },
  {
    slug: "microondas-lg-28l-digital",
    title: "Microondas LG 28L Digital",
    description:
      "Microondas LG 28 litros con panel digital. Grill incluido. Funciona perfecto, lo limpiamos bien. Solo se va porque en México vienen con microondas.",
    price_clp: 65000,
    condition: "usado" as const,
    status: "disponible" as const,
    category: "electrodomésticos",
    image_urls: [] as string[],
  },
];

async function main() {
  console.log("Seeding database...");
  await db.insert(products).values(seedProducts).onConflictDoNothing();
  console.log("Done! 8 products inserted.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
