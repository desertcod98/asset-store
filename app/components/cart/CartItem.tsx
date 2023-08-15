"use client"

import { CartItem } from "@/hooks/useCart";
import supabase from "@/lib/supabase";
import Image from "next/image";
import AddToCart from "../AddToCart";

export default function CartItem({cartItem}: {cartItem: CartItem}){
    const thumbnailUrl = cartItem.asset.thumbnailPath
    ? supabase.storage
        .from("assetImages")
        .getPublicUrl(cartItem.asset.thumbnailPath).data.publicUrl
    : "/assets/noImage.png";
    return (
        <div className="flex flex-row justify-between items-center w-full border-2 p-4 rounded-xl border-gray-300">
            <Image
                src={thumbnailUrl}
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