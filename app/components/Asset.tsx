import { assets } from "@/db/schema";
import { InferModel } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import AddToCart from "./AddToCart";

type Asset = InferModel<typeof assets> & { author: { name: string } };

export default async function Asset(asset: Asset) {

  return (
    <div className="flex flex-col h-60 w-60  rounded overflow-hidden">
      <Link
        className="relative w-60 aspect-video overflow-hidden"
        href={"/asset/" + asset.id}
      >
        <Image
          src={asset.thumbnailUrl || "/assets/noImage.png"}
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
        <div className="flex flex-row w-full justify-between items-center relative">
          <span>{asset.priceCents / 100} $</span>
          <div className="absolute right-2 bottom-2">
            <AddToCart asset={{asset, price: asset.priceCents}}/>
          </div>
        </div>
      </div>
    </div>
  );
}
