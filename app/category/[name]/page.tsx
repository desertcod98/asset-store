import db from "@/db";
import { assetCategories, assets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Asset from "../../components/Asset";
import Header from "@/app/components/Header";

export default async function AssetCategory({
  params,
}: {
  params: { name: string };
}) {
  const [category] = await db
    .select()
    .from(assetCategories)
    .where(eq(assetCategories.name, params.name.toUpperCase()))
    .limit(1);

  if (!category) {
    redirect("/");
  }
  const categoryAssets = await db.query.assets.findMany({
    with: {
      author: {
        columns: {
          name: true,
        }
      }
    }
  })
  
  return (
    <div>
      <Header />
      <div className="w-full h-full  flex-col items-center flex gap-10 mt-5">
        <div className="flex items-center">
          <span className="font-medium">{categoryAssets.length + " results"}</span>
        </div>
        <div className="w-3/4 flex gap-10 flex-wrap">
          {categoryAssets.map((asset) => {
            return <Asset key={asset.id} {...asset} />;
          })}
        </div>
      </div>
    </div>
  );
}
