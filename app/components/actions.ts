"use server";

import db from "@/db";
import getCurrentUser from "../actions/getCurrentUser";
import { assets, assetsInCarts, carts } from "@/db/schema";
import { and, eq, isNull, placeholder } from "drizzle-orm";
//TODO find way to explicit errors
export async function sAddToCart(assetId: number) {
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
    }).prepare("create_asset_in_cart");

  const pGetAssetPrice = db.select({price: assets.priceCents}).from(assets).where(eq(assets.id, placeholder("assetId"))).prepare("get_asset_price");

  const user = await getCurrentUser();
  if (!user) return new Error();
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

  await pCreateAssetInCart.execute({assetId, cartId: existingCart.id, price: asset.price})
}
