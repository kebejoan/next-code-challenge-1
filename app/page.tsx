import { Product } from "@/types";
import { CATALOG_DATA } from "@/data/dummy";
import FilterComponent from "@/components/FilterComponent";

interface pageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function Home({ searchParams }: pageProps) {
  // FETCHING FROM .json still doesnt work. I will work with const object for now
  // const res = await fetch("http://localhost:3000/data/dummy.json");
  // const data = await res.json();

  const params = await searchParams; //why does this must be await but it hints that "'await' has no effect on the type of this expression."
  const { category, subcategory, brand } = params;

  const data = CATALOG_DATA; //--> CATALOG_DATA must be changed to be coming from a .json rather than const

  //brain of the filter
  const filteredData = CATALOG_DATA.products.filter((p: Product) => {
    if (brand) return p.brandId === brand;

    if (subcategory) {
      const brandsInSub = CATALOG_DATA.brands
        .filter((b) => b.subCategoryId === subcategory)
        .map((b) => b.id);
      return brandsInSub.includes(p.brandId);
    }

    if (category) {
      const subsInCat = CATALOG_DATA.subCategories
        .filter((s) => s.categoryId === category)
        .map((s) => s.id);
      const brandsInCat = CATALOG_DATA.brands
        .filter((b) => subsInCat.includes(b.subCategoryId))
        .map((b) => b.id);
      return brandsInCat.includes(p.brandId);
    }

    return true;
  });

  return (
    <main className="w-full flex flex-col md:flex-row ">
      {/* Comboboxes / FilterControls */}
      <div className="w-1/4 outline-1">
        <FilterComponent data={data} />
      </div>
      <div className="grow flex flex-col outline-2">
        {/* Breadcrumbs */}
        <nav> Breadcrumbs </nav>
        {/* Products */}
        <section>
          <h1>Products</h1>
          {filteredData.map((product: Product) => (
            <div key={product.id}>
              <h2>{product.name}</h2>
              <p>Rp {product.price}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
