import db from "@/db"
import AssetToModerate from "./components/AssetToModerate";

export default async function Admin(){
  let unModeratedAssets = await db.query.assets.findMany({
    with: {
      assetImages: true,
      assetModeration: true,
    }
  })

  unModeratedAssets = unModeratedAssets.filter(asset => asset.assetModeration.state === "PENDING");

  return (
    <ul>
      {unModeratedAssets.map(asset => {
        return (
          <AssetToModerate name={asset.name} id={asset.id} key={asset.id}/>
        )
      })}
    </ul>
  )
}