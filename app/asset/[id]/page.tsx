import { redirect } from "next/navigation";
import db from "@/db";
import { assetImages, assets } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import supabase from "@/lib/supabase";
import Header from "@/app/components/Header";

export default async function AssetDetail({ params }: { params: { id: string } }) {
  const id: number = +params.id;
  if (Number.isNaN(id)) {
    redirect("/");
  }

  const asset = await db
    .select()
    .from(assets)
    .innerJoin(assetImages, eq(assetImages.assetId, assets.id))
    .where(eq(assets.id, id))

  const allAssetImages = asset.map(assetImage => {
    return supabase.storage.from("assetImages").getPublicUrl(assetImage.asset_images.imagePath).data.publicUrl;
  })

  return (
    <div>
      <Header/>
      <span>{asset[0].assets.name}</span>
      {allAssetImages.map(assetImage => {
        return <Image src={assetImage} alt={asset[0].assets.name + ' image'} key={assetImage} width={50} height={50}/>
      })}
    </div>
  );
}

//TODO save paths in database (like '1/image.png') so you can delete them ecc.
async function getAssetImages(assetId: number) {
  const imagesData = (
    await supabase.storage.from("assetImages").list(assetId.toString() + "/")
  ).data;
  if (!imagesData) return null;
  console.log(imagesData);
  const images = imagesData.map((image) => {
    return supabase.storage
      .from("assetImages")
      .getPublicUrl(assetId.toString() + "/" + image.name).data.publicUrl;
  });
  return images;
}
