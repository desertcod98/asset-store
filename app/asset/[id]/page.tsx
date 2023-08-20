import { redirect } from "next/navigation";
import db from "@/db";
import { assetImages, assets } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Header from "@/app/components/Header";

export default async function AssetDetail({ params }: { params: { id: string } }) {
  const id: number = +params.id;
  if (Number.isNaN(id)) {
    redirect("/");
  }

  // const [asset] = await db
  //   .select()
  //   .from(assets)
  //   .innerJoin(assetImages, eq(assetImages.assetId, assets.id))
  //   .where(eq(assets.id, id))

  const asset = await db.query.assets.findFirst({
    with: {
      assetImages : true,
    },
    where: (eq(assets.id, id))
  })

  if(!asset){
    redirect("/");
  }
  return (
    <div className="w-full h-full">
      <Header/>
      <span>{asset.name}</span>
      {asset?.assetImages.map(assetImage => {
        return <Image src={assetImage.imageUrl} alt={asset.name + ' image'} key={assetImage.imageKey} width={50} height={50}/>
      })}
    </div>  
  );
}

