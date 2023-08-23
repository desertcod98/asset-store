import AssetCategories from "../../../app/components/AssetCategories";
import Header from "../../../app/components/header/Header";
import AssetList from "../../../app/components/assetList/AssetList";
import db from "../../../db";
import { assets } from "../../../db/schema";
import { ilike } from "drizzle-orm";

export default async function Search({ params }: { params: { slug: string } }) {
  let searchAssets = [];

  if(params.slug){
    searchAssets = await db.query.assets.findMany({
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
      where: ilike(assets.name, "%" + params.slug + "%"),
    });
  }else{
    searchAssets = await db.query.assets.findMany({
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
    });
  }
  
  
  searchAssets = searchAssets.filter(
    (asset) => asset.assetModeration.state === "ACCEPTED"
  );
  return (
    <>
      <Header searchBarValue={params.slug}/>
      <AssetCategories />
      <AssetList assets={searchAssets} text={"Query: "+(params.slug || "[empty]")}/>
    </>   
  );
}
