import db from "@/db";
import { assetCategories } from "@/db/schema";
import AssetCategory from "./AssetCategory";

export default async function AssetCategories({selectedId} : {selectedId?: number}){
  const allAssetCategories = await db.select().from(assetCategories);

  return (
    <div className="w-full h-20 flex justify-center">
        <div className="w-3/4 h-full bg-slate-50 flex items-center px-3 gap-3 justify-center">
          {allAssetCategories.map((category) => {
            if(selectedId && selectedId === category.id)
            return <AssetCategory key={category.id} {...category} selected/>;
            return <AssetCategory key={category.id} {...category}/>;
          })}
        </div>
      </div>
  )
}