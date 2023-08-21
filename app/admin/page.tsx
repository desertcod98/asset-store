import db from "@/db"

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
          <li key = {asset.id}>{asset.name}</li>
        )
      })}
    </ul>
  )
}