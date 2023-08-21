import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/db";
import { assets, assetsModerations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const RequestData = z.object({
  assetId: z.number(),
  state: z.enum(["ACCEPTED", "REJECTED"]),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if(!user){
        return new NextResponse("Not logged in", { status: 403 }); 
    }

    if(user.role !== "ADMIN"){
      return new NextResponse("Forbidden", { status: 403 }); 
    }

    const body = await request.json();
    const zodParse = RequestData.safeParse(body);

    if(!zodParse.success){
       console.log(zodParse.error)
      return new NextResponse("Bad request", { status: 400 });
    }

    const parsedBody = zodParse.data;

    const [asset] = await db.select({moderationId: assets.moderationId}).from(assets).where(eq(assets.id, parsedBody.assetId));
    await db.update(assetsModerations).set({state: parsedBody.state}).where(eq(assetsModerations.id, asset.moderationId));

    return NextResponse.json("Ok", {status: 200});
  } catch (error: any) {
    console.log(error, "MODERATE_ERROR");
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}