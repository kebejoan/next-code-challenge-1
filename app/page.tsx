import { Product } from "@/types";
import { CATALOG_DATA } from "@/data/dummy";

interface pageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function Home({ searchParams }: pageProps) {
  // FETCHING FROM .json still doesnt work. I will work with const object for now
  // const res = await fetch("http://localhost:3000/data/dummy.json");
  // const data = await res.json();

  const params = await searchParams; //why does this must be await but it hints that it does not affect
  const { category, subcategory, brand } = params;

  const data = CATALOG_DATA;

  const filteredData = CATALOG_DATA.products.filter((p: Product) => {
    if (brand) return p.brandId === brand;
    return true;
  });

  return (
    <main className="">
      <section>
        <h1>Products</h1>
        {filteredData.map((product: Product) => (
          <div key={product.id}>
            <p>{product.id}</p>
            <h2>{product.name}</h2>
            <p>{product.brandId}</p>
            <p>${product.price}</p>
          </div>
        ))}
      </section>
      <div>
        <p>Category: {category}</p>
        <p>Subcategory: {subcategory}</p>
        <p>Brand: {brand}</p>
      </div>
    </main>
  );
}
