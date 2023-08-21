import getCurrentUser from "@/app/actions/getCurrentUser";

import { NextResponse } from "next/server";
import db from "@/db";
import { assetImages, assets, assetsModerations } from "@/db/schema";
import { placeholder } from "drizzle-orm"; 

import { z } from "zod";

const pCreateAsset = db
  .insert(assets)
  .values({
    assetCategoryId: placeholder("categoryId"),
    authorId: placeholder("authorId"),
    description: placeholder("description"),
    name: placeholder("name"),
    priceCents: placeholder("priceCents"),
    thumbnailKey: placeholder("thumbnailKey"),
    thumbnailUrl: placeholder("thumbnailUrl"),
    moderationId: placeholder("moderationId"),
    assetFileKey: placeholder("assetFileKey"),
    assetFileUrl: placeholder("assetFileUrl"),
  })
  .returning({ id: assets.id })
  .prepare("create_asset");

const pInsertAssetImage = db
  .insert(assetImages)
  .values({
    assetId: placeholder("assetId"),
    imageKey: placeholder("imageKey"),
    imageUrl: placeholder("imageUrl"),
  })
  .prepare("insert_asset_image");

const pInsertModeration = db
  .insert(assetsModerations)
  .values({state: assetsModerations.state.default}) //need to insert a default value, empty query is wrong in drizzle
  .returning({id: assetsModerations.id})
  .prepare('insert_asset_moderation')


const Files = z.array(
  z.object({
    key: z.string(),
    url: z.string(),
  })
).nonempty();

const RequestData = z.object({
  name: z.string(),
  description: z.string(),
  file: Files,
  thumbnail: Files,
  images: Files,
});

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return new NextResponse("Not logged in", { status: 403 });
  }

  try {
    const body = await request.json();
    const zodParse = RequestData.safeParse(body);

    if(!zodParse.success){
       console.log(zodParse.error)
      return new NextResponse("Bad request", { status: 400 });
    }

    const parsedBody = zodParse.data;
    const category = 2; //TODO REMOVE HARDCODED
    const price = 1111;

    //Insert moderation
    const [assetModeration] = await pInsertModeration.execute();

    
    // Create db entry
    const [asset] = await pCreateAsset.execute({
      categoryId: category,
      authorId: user.id,
      description: parsedBody.description,
      name: parsedBody.name,
      priceCents: price,
      thumbnailKey: parsedBody.thumbnail[0].key,
      thumbnailUrl: parsedBody.thumbnail[0].url,
      moderationId: assetModeration.id,
      assetFileKey: parsedBody.file[0].key,
      assetFileUrl: parsedBody.file[0].url,
    });

    // Upload asset images and add them to database
    for (const image of parsedBody.images) {
      await pInsertAssetImage.execute({
        imageKey: image.key,
        imageUrl: image.url,
        assetId: asset.id,
      });
    }
    return new NextResponse("Success", { status: 200 });
  } catch (error: any) {
    console.log(error, "ASSET_UPLOAD_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
