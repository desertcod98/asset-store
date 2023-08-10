import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/db";
import { assetImages, assets, assetsModerations, users } from "@/db/schema";
import supabase from "@/lib/supabase";
import { placeholder } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";

const pCreateAsset = db
  .insert(assets)
  .values({
    assetCategoryId: placeholder("categoryId"),
    authorId: placeholder("authorId"),
    description: placeholder("description"),
    name: placeholder("name"),
    priceCents: placeholder("priceCents"),
    thumbnailPath: placeholder("thumbnailPath"),
    moderationId: placeholder("moderationId"),
  })
  .returning({ id: assets.id })
  .prepare("create_asset");

const pInsertAssetImage = db
  .insert(assetImages)
  .values({
    assetId: placeholder("assetId"),
    imagePath: placeholder("imagePath"),
  })
  .prepare("insert_asset_image");

const pInsertModeration = db
  .insert(assetsModerations)
  .values({})
  .returning({id: assetsModerations.id})
  .prepare('insert_asset_moderation')

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return new NextResponse("Not logged in", { status: 403 });
  }

  try {

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const files = formData.getAll("files");
    const thumbnail = formData.get("thumbnail");
    const images = formData.getAll("images");
    const category = 2; //TODO REMOVE HARDCODED
    const price = 1000;
    if (!files || !thumbnail || !name || !description || !images) {
      return new NextResponse("Missing info", { status: 400 });
    }

    //Upload thumbnail to Supabase
    if (typeof thumbnail === "string") {
      return new NextResponse("Bad request", { status: 400 });
    }
    const thumbnailCuid = createId();
    const thumbnailPath = thumbnailCuid + "-" + thumbnail.name;
    
    console.log(thumbnail)
    console.log(thumbnailPath)

    //TODO important, next lines throws error, a thread on stackoverflow says its better uploading on the client
    await supabase.storage.from("assetImages").upload(thumbnailPath, thumbnail);

    //Insert moderation
    const [assetModeration] = await pInsertModeration.execute();

    // Create db entry
    const [asset] = await pCreateAsset.execute({
      categoryId: category,
      authorId: user.id,
      description,
      name,
      priceCents: price,
      thumbnailPath,
      moderationId: assetModeration.id
    });
    console.log("a")
    // Upload asset files
    for (const file of files) {
      if (typeof file !== "string") {
        await supabase.storage
          .from("assets")
          .upload(asset.id.toString() + "/" + file.name, file);
      }
    }

    // Upload asset images and add them to database
    for (const image of images) {
      if (typeof image !== "string") {
        const imagePath = asset.id.toString() + "/" + image.name;

        await supabase.storage.from("assetImages").upload(imagePath, image);
        await pInsertAssetImage.execute({
          imagePath,
          assetId: asset.id,
        });
      }
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error: any) {
    console.log(error, "ASSET_UPLOAD_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
