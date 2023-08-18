"use client"

import { CartItem } from "@/hooks/useCart";
import Image from "next/image";
import AddToCart from "../AddToCart";

export default function CartItem({cartItem}: {cartItem: CartItem}){
    return (
        <div className="flex flex-row justify-between items-center w-full border-2 p-4 rounded-xl border-gray-300">
            <Image
                src={cartItem.asset.thumbnailUrl || "/assets/noImage.png"}
                alt={cartItem.asset.name}
                width={100}
                height={100}
            />
            <span>{cartItem.asset.name}</span>
            <div className = "flex flex-col items-center gap-2">
                <span>{cartItem.price/100} $</span>
                <AddToCart asset={cartItem.asset} price={cartItem.price}/>
            </div>
        </div>
    )
}