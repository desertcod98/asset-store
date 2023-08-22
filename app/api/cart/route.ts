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

    const cart = await getCartAssets(user.id);

    const assets = cart ? cart.assetsInCarts : [];

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

    let existingCart = await getCart(user.id)
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

export async function DELETE(request: Request){
  try {
    const user = await getCurrentUser();
    if(!user){
        return new NextResponse("Not logged in", { status: 403 }); 
    }
    const { searchParams } = new URL(request.url);
    const assetIdParams = searchParams.get("assetId");

    if (!assetIdParams) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const assetId: number = +assetIdParams;
    if (Number.isNaN(assetId)) {
      return new NextResponse("Bad request", { status: 400 });
    }

    const cart = await getCart(user.id);

    if(!cart){
      return new NextResponse("Cart is empty", { status: 400 }); 
    }

    const [deletedAsset] = await db
      .delete(assetsInCarts)
      .where(and(eq(assetsInCarts.assetId, assetId), eq(assetsInCarts.cartId, cart.id)))
      .returning({assetId: assetsInCarts.assetId, price: assetsInCarts.price});

    return NextResponse.json(deletedAsset);
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}

async function getCart(userId: string){
  const [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), isNull(carts.bought_at)))
    .limit(1);
  return cart;
}

async function getCartAssets(userId: string){
  const [cart] = await db.query.carts.findMany({
    with:{
        assetsInCarts: {
            with: {
              asset: {
                with: {
                  author: {
                    columns: {
                      name: true,
                    }
                  }
                }
              }
            },
            columns: {
              price: true,
          },
        },
    },
    where: and(eq(carts.userId, userId), isNull(carts.bought_at))
  })
  return cart;
}

