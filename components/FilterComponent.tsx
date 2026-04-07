"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CatalogData } from "@/types";

export default function FilterComponent({ data }: { data: CatalogData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category");
  const selectedSubcategory = searchParams.get("subcategory");
  const selectedBrand = searchParams.get("brand");

  const availableSubcategories = data.subCategories.filter(
    (sub) => sub.categoryId === selectedCategory,
  );
  const availableBrands = data.brands.filter(
    (brand) => brand.subCategoryId === selectedSubcategory,
  );

  const handleChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    if (name === "category") {
      params.delete("subcategory");
      params.delete("brand");
    }
    if (name === "subcategory") {
      params.delete("brand");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(`${pathname}`);
  };

  return (
    <div className="flex flex-col gap-4 ">
      <h1 className="font-bold">Filter Your Product</h1>
      {/* SELECT CATEGORY */}
      <select
        name="category"
        value={selectedCategory || ""}
        onChange={(e) => handleChange("category", e.target.value)}
        className="bg-slate-200 p-2 disabled:bg-gray-200 disabled:text-gray-300"
      >
        <option value="" disabled>
          Main Category
        </option>
        {data.categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {/* SELECT SUB-CATEGORY */}
      <select
        name="subcategory"
        value={selectedSubcategory || ""}
        onChange={(e) => handleChange("subcategory", e.target.value)}
        disabled={!selectedCategory}
        className="bg-slate-200 p-2 disabled:bg-gray-200 disabled:text-gray-300"
      >
        <option value="" disabled>
          Sub-Category
        </option>
        {availableSubcategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {/* SELECT BRAND */}
      <select
        name="brand"
        value={selectedBrand || ""}
        onChange={(e) => handleChange("brand", e.target.value)}
        disabled={!selectedSubcategory}
        className="bg-slate-200 p-2 disabled:bg-gray-200 disabled:text-gray-300"
      >
        <option value="" disabled>
          Brand
        </option>
        {availableBrands.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        className="cursor-pointer bg-slate-400 rounded-md p-2 font-bold"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
}
