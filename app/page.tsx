import { CatalogData, Product } from "@/types";
// import { CATALOG_DATA } from "@/data/dummy"; --> Reverted to fetching from JSON instead. Interface and type still works OK
import FilterComponent from "@/components/FilterComponent";

interface pageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function Home({ searchParams }: pageProps) {
  // FETCHING FROM .json still doesnt work. I will work with const object for now
  const res = await fetch("http://localhost:3000/dummy.json"); // This actually works now
  const CATALOG_DATA: CatalogData = await res.json();

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

  // Logic for breadcrumbs, find name of category, subcategory, brand from id
  const categoryName = data.categories.find((c) => c.id === category)?.name;
  const subcategoryName = data.subCategories.find(
    (s) => s.id === subcategory,
  )?.name;
  const brandName = data.brands.find((b) => b.id === brand)?.name;

  return (
    <main className="text-black">
      <div className="w-full text-center font-bold text-2xl">
        <h1>RevoU Code Challenge #1 - Kebejoan</h1>
      </div>
      <div className="w-full flex flex-col md:flex-row ">
        {/* Comboboxes / FilterControls */}
        <div className=" md:w-1/6 rounded-md m-2 p-2 bg-slate-100">
          <FilterComponent data={data} />
        </div>
        <section className="grow flex flex-col rounded-md m-2 p-2 bg-slate-100">
          <h1 className="text-2xl font-bold">Products</h1>
          {/* Breadcrumbs - with aria-label and class */}
          <nav
            className="product-breadcrumb border-b-2 border-slate-300 font-bold text-sm wrap text-gray-600"
            aria-label="breadcrumbs"
          >
            <span className="text-slate-500">Home</span>

            {categoryName && (
              <>
                <span className="mx-2 text-slate-400">{">"}</span>
                <span>{categoryName}</span>
              </>
            )}

            {subcategoryName && (
              <>
                <span className="mx-2 text-slate-400">{">"}</span>
                <span>{subcategoryName}</span>
              </>
            )}

            {brandName && (
              <>
                <span className="mx-2 text-slate-400">{">"}</span>
                <span className="text-blue-600">{brandName}</span>
              </>
            )}
          </nav>
          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {filteredData.map((product: Product) => (
              <div className="p-2 rounded-md bg-slate-200" key={product.id}>
                <h2 className="font-bold">{product.name}</h2>
                <p>Rp {product.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
