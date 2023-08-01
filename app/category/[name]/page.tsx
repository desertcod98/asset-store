import db from "@/db"
import { assetCategories, assets } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import Asset from "./components/Asset";

export default async function AssetCategory({ params }: { params: { name: string } }){
  const [category] = await db.select().from(assetCategories).where(eq(assetCategories.name, params.name.toUpperCase())).limit(1);
  if(!category){
    redirect("/");
  }
  const categoryAssets = await db.select().from(assets).where(eq(assets.assetCategoryId, category.id))
  return (
    <div>
      {categoryAssets.map(asset => {
        return <Asset key={asset.id}/>
      })}
    </div>
  )
}