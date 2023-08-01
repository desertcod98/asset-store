import { assets, users } from "@/db/schema";
import supabase from "@/lib/supabase";
import { InferModel } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

type Asset = InferModel<typeof assets> & { author: { name: string } };

export default async function Asset(asset: Asset) {
  const thumbnailUrl = asset.thumbnailPath
    ? await supabase.storage
        .from("assetImages")
        .getPublicUrl(asset.thumbnailPath).data.publicUrl
    : "/assets/noImage.svg";

  return (
    <div className="flex flex-col h-60 w-60  rounded overflow-hidden">
      <Link
        className="relative w-60 aspect-video overflow-hidden"
        href={"/asset/" + asset.id}
      >
        <Image
          src={thumbnailUrl}
          alt={asset.name}
          fill
          className="object-cover"
        />
      </Link>
      <div className="flex flex-col mt-2 px-3">
        <span className="font-extralight text-sm">{asset.author.name}</span>
        <Link href={"/asset/" + asset.id} className="w-fit">
          <span className="font-medium text-lg">{asset.name}</span>
        </Link>
        <span>TODO stars</span>
        <div className="flex flex-row w-full justify-between items-center">
          <span>{asset.priceCents / 100} $</span>
          <Button>
            <span className="text-lg">+</span>
            <Image
              src={"/assets/cart.svg"}
              alt="Add to cart image"
              width={20}
              height={20}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}