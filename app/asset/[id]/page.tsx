import { redirect } from "next/navigation";
import db from "@/db";
import { assets } from "@/db/schema";
import { eq } from "drizzle-orm";
import Header from "@/app/components/Header";
import CarouselComponent from "@/app/components/CarouselComponent";
import AddToCart from "@/app/components/AddToCart";

export default async function AssetDetail({ params }: { params: { id: string } }) {
  const id: number = +params.id;
  if (Number.isNaN(id)) {
    redirect("/");
  }

  const asset = await db.query.assets.findFirst({
    with: {
      assetImages : true,
      author: {
        columns: {
          name: true,
          image: true,
        }
      },
      assetModeration: {
       columns: {
        state: true,
       } 
      }
    },
    where: (eq(assets.id, id))
  })

  if(!asset){
    redirect("/");
  }

  if(asset.assetModeration.state !== "ACCEPTED"){
    redirect("/");
  }

  return (
    <div className="w-full h-full">
      <Header/>
      <div className="flex w-full justify-center gap-3">
        <div className="flex w-1/3  h-full justify-center">
          <div className="flex flex-col h-full">
            <CarouselComponent imagesUrls={asset.assetImages.map(image => image.imageUrl)}/>
          </div>
        </div>
        <div className="flex w-1/3 flex-col bg-yellow-100 h-80 p-3">
          <h1 className="text-2xl">{asset.name}</h1>
          <span>{asset.author.name}</span>
          <span>{asset.priceCents/100}$</span>
          <AddToCart text asset={{asset, price: asset.priceCents}}/>
        </div>
      </div>
    </div>  
  );
}

