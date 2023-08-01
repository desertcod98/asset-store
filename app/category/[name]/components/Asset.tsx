import { assets } from "@/db/schema";
import { InferModel } from "drizzle-orm";
import supabase from "@/lib/supabase";
import Image from "next/image";

type Asset = InferModel<typeof assets>;

export default async function Asset(asset: Asset) {
  const images = await getAssetImages(asset.id);
  return (
    <div className="flex flex-col h-52 w-60 bg-yellow-100">
      <Image
        src={images ? images[0] : "/assets/noImage.svg"}
        alt={asset.name}
        width={100}
        height={200}
      />
    </div>
  );
}

async function getAssetImages(assetId: number) {
  const imagesData = (
    await supabase.storage.from("assetImages").list(assetId.toString() + "/")
  ).data;
  if (!imagesData) return null;
  const images = imagesData.map((image) => {
    return supabase.storage
      .from("assetImages")
      .getPublicUrl(assetId.toString() + "/" + image.name).data.publicUrl;
  });
  return images;
}
