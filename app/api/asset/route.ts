import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/db";
import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if(!user){
    return new NextResponse("Not logged in", { status: 403 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const files = formData.getAll("files");
    const thumbnail = formData.get("thumbnail");
    const images = formData.getAll("images");

    if (!files || !thumbnail || !name || !description || !images) {
      return new NextResponse("Missing info", { status: 400 });
    }

    if(typeof files[0] !== "string") {
      await supabase.storage.from('assets').upload(files[0].name, files[0]);
    }

    return NextResponse.json("");
  } catch (error: any) {
    console.log(error, "ASSET_UPLOAD_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
