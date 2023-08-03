import db from "@/db";
import Header from "../components/Header";
import { assetCategories } from "@/db/schema";
import AssetCategory from "./components/AssetCategory";


export default async function Home() {
  const allAssetCategories = await db.select().from(assetCategories);
  return (
    <div>
      <Header />
      <div className="w-full h-20 flex justify-center">
        <div className="w-3/4 h-full bg-slate-50 flex items-center px-3 gap-3 justify-center">
          {allAssetCategories.map((category) => {
            return <AssetCategory key={category.id} {...category}/>;
          })}
        </div>
      </div>
    </div>
  );
}
