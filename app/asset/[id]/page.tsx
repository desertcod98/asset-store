import { redirect } from "next/navigation";
import db from "@/db";
import { assets } from "@/db/schema";
import { eq } from "drizzle-orm";
import Header from "@/app/components/header/Header";
import CarouselComponent from "@/app/components/CarouselComponent";
import AddToCart from "@/app/components/AddToCart";
import Image from "next/image";
import Stars from "@/app/components/Stars";

export default async function AssetDetail({
  params,
}: {
  params: { id: string };
}) {
  const id: number = +params.id;
  if (Number.isNaN(id)) {
    redirect("/");
  }

  const asset = await db.query.assets.findFirst({
    with: {
      assetImages: true,
      author: {
        columns: {
          name: true,
          image: true,
        },
      },
      assetModeration: {
        columns: {
          state: true,
        },
      },
    },
    where: eq(assets.id, id),
  });

  if (!asset) {
    redirect("/");
  }

  if (asset.assetModeration.state !== "ACCEPTED") {
    redirect("/");
  }

  return (
    <div className="w-full h-full">
      <Header />
      <div className="flex w-full justify-center gap-3 mt-3">
        <div className="flex w-2/5  h-full justify-center">
          <div className="flex flex-col h-full">
            <CarouselComponent
              imagesUrls={asset.assetImages.map((image) => image.imageUrl)}
            />
          </div>
        </div>
        <div className="flex w-1/3 flex-col h-80 p-3 gap-5">
          <h1 className="text-2xl font-semibold">{asset.name}</h1>
          <div className="flex items-center gap-2 my-2">
            <Image
              src={asset.author.image || "/assets/noProfileImage.svg"}
              alt={asset.author + " profile image"}
              width={30}
              height={30}
              className="rounded"
            />
            <div className="w-1/2 flex justify-between">
              <span>{asset.author.name}</span>
              <Stars percentage={50} text />
            </div>
          </div>
          <span className="max-h-80 overflow-y-auto">{asset.description}</span>
          <div className="flex w-1/2 justify-between">
            <span className="text-green-600 text-3xl font-semibold">
              {asset.priceCents / 100}$
            </span>
            <AddToCart text asset={{ asset, price: asset.priceCents }} />
          </div>
        </div>
      </div>
    </div>
  );
}
