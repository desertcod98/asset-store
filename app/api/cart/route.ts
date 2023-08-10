import db from "@/db";
import { NextResponse } from "next/server";
import { carts, assetsInCarts } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: Request) {
  try {

    const user = await getCurrentUser();
    if(!user){
        return new NextResponse("Not logged in", { status: 403 }); 
    }

    //const cart = await db.select().from(carts).where(and(eq(carts.userId, user.id), isNull(carts.bought_at))).innerJoin(assetsInCarts, eq(carts.id, assetsInCarts.cartId))


    const [cart] = await db.query.carts.findMany({
        with:{
            assetsInCarts: {
                columns: {
                    assetId: true,
                    price: true,
                }
            },
        },
        where: and(eq(carts.userId, user.id), isNull(carts.bought_at))
    })

    let assets: any[] = [];

   if(cart){
    assets = cart.assetsInCarts; 
   }

    return NextResponse.json(assets);
  } catch (error: any) {
    console.log(error, "CART_GET_ERROR");
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}
