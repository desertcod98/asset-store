import { assets } from "@/db/schema";
import { InferModel } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

type Asset = InferModel<typeof assets>;

export default async function Asset(asset: Asset) {
  return (
    <Link className="flex flex-col h-52 w-60 bg-yellow-100" href={"/asset/"+asset.id}>
      <Image
        src={asset.thumbnailUrl || "/assets/noImage.svg"}
        alt={asset.name}
        width={100}
        height={200}
      />
      <span>{asset.name}</span>
    </Link>
  );
}

