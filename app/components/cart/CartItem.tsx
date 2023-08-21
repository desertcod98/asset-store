"use client"

import { CartItem } from "@/hooks/useCart";
import Image from "next/image";
import AddToCart from "../AddToCart";

export default function CartItem({cartItem}: {cartItem: CartItem}){
    return (
        <div className="flex flex-row justify-between items-center w-full border-2 p-4 rounded-xl border-gray-300">
          <div className="w-[120px] h-[100px] relative">
            <Image
                  src={cartItem.asset.thumbnailUrl || "/assets/noImage.png"}
                  alt={cartItem.asset.name}
                  fill
                  className="object-cover rounded"
              />
          </div>
           
            <span>{cartItem.asset.name}</span>
            <div className = "flex flex-col items-center gap-2">
                <span>{cartItem.price/100} $</span>
                <AddToCart asset={{asset: cartItem.asset, price: cartItem.asset.priceCents}}/>
            </div>
        </div>
    )
}