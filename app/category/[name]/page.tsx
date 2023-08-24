import db from "@/db";
import { assetCategories, assets, assetsModerations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Header from "@/app/components/header/Header";
import AssetCategories from "@/app/components/AssetCategories";
import AssetList from "@/app/components/assetList/AssetList";

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
  let categoryAssets = await db.query.assets.findMany({
    with: {
      author: {
        columns: {
          name: true,
        },
      },
      assetModeration: {
        columns: {
          state: true,
        },
      },
    },
    where: eq(assets.assetCategoryId, category.id),
  });

  categoryAssets = categoryAssets.filter(
    (asset) => asset.assetModeration.state === "ACCEPTED"
  );

  return (
    <div>
      <Header />
      <AssetCategories selectedId={category.id}/>
      <AssetList assets={categoryAssets}/>
    </div>
  );
}
