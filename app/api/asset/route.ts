import db from "@/db";
import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const files = formData.get("files");
    const thumbnail = formData.get("thumbnail");

    if (!files || !thumbnail || !name || !description) {
      return new NextResponse("Missing info", { status: 400 });
    }

    

    return NextResponse.json("");
  } catch (error: any) {
    console.log(error, "ASSET_UPLOAD_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
