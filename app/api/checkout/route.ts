import getCartAssets from "@/app/actions/getCartAssets";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { stripe } from "@/app/actions/getServerStripe";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if(!user){
      return new NextResponse("Not logged in", { status: 403 }); 
  }

  try {
    const cartAssets = await getCartAssets(user.id);
    const lineItems = cartAssets.assetsInCarts.map(cartItem => {
      return {
        price_data: {
          currency: "USD",
          product_data: {
            name: cartItem.asset.name,
            //todo add images
          },
          unit_amount: cartItem.price,
        },
        quantity: 1
      };
    })

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["NO"],
      },
      mode: "payment",
      success_url: `https://localhost:3000/success`,
      cancel_url: `https://localhost:3000/cancel`,
      phone_number_collection: {
        enabled: true,
      },
    });
  
    return NextResponse.json({sessionUrl: session.url});
  } catch (error: any) {
    console.log(error, "CHECKOUT_ERROR");
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}
