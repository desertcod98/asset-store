import db from "@/db";
import { carts } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export default async function getCartAssets(userId: string){
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