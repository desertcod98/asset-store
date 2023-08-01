import { assets } from "@/db/schema";
import supabase from "@/lib/supabase";
import { InferModel } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

type Asset = InferModel<typeof assets>;

export default async function Asset(asset: Asset) {
  const thumbnailUrl = asset.thumbnailPath
    ? await supabase.storage
        .from("assetImages")
        .getPublicUrl(asset.thumbnailPath).data.publicUrl
    : "/assets/noImage.svg";

  return (
    <Link
      className="flex flex-col h-52 w-60 bg-yellow-100"
      href={"/asset/" + asset.id}
    >
      <Image src={thumbnailUrl} alt={asset.name} width={100} height={200} />
      <span>{asset.name}</span>
    </Link>
  );
}
