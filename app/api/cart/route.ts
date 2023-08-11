import db from "@/db";
import { NextResponse } from "next/server";
import { carts, assetsInCarts, assets } from "@/db/schema";
import { eq, and, isNull, placeholder } from "drizzle-orm";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: Request) {
  try {

    const user = await getCurrentUser();
    if(!user){
        return new NextResponse("Not logged in", { status: 403 }); 
    }

    const cart = await getCart(user.id);

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


const pCreateCart = db
.insert(carts)
.values({ userId: placeholder("userId") })
.returning()
.prepare("create_cart");
const pCreateAssetInCart = db
.insert(assetsInCarts)
.values({
  assetId: placeholder("assetId"),
  cartId: placeholder("cartId"),
  price: placeholder("price"),
}).returning({assetId: assetsInCarts.assetId, price: assetsInCarts.price}).prepare("create_asset_in_cart");

const pGetAssetPrice = db.select({price: assets.priceCents}).from(assets).where(eq(assets.id, placeholder("assetId"))).prepare("get_asset_price");


export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if(!user){
        return new NextResponse("Not logged in", { status: 403 }); 
    }
    const body = await request.json();
    const { assetId } = body;

    if (!assetId) {
      return new NextResponse("Missing info", { status: 400 });
    }

    let [existingCart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, user.id), isNull(carts.bought_at)))
    .limit(1);
  if (!existingCart) {
    const [cart] = await pCreateCart.execute({ userId: user.id });
    existingCart = cart;
  }
  const [asset] = await pGetAssetPrice.execute({assetId});

  const [addedAsset] = await pCreateAssetInCart.execute({assetId, cartId: existingCart.id, price: asset.price})

    return NextResponse.json(addedAsset);
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}

async function getCart(userId: string){
  const [cart] = await db.query.carts.findMany({
    with:{
        assetsInCarts: {
            columns: {
                assetId: true,
                price: true,
            }
        },
    },
    where: and(eq(carts.userId, userId), isNull(carts.bought_at))
  })
  return cart;
}
