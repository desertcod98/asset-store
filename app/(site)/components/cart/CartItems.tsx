import { useCart } from "@/hooks/useCart"
import Image from "next/image";
import supabase from "@/lib/supabase";

export default function CartItems(){
    const cart = useCart();
    //TODO supabase gives error because this is probably inside a client component and it cannot access .env
    return (
        <div>
            {cart.get.data?.map(async (cartItem) => {
                const thumbnailUrl = cartItem.asset.thumbnailPath
                ? await supabase.storage
                    .from("assetImages")
                    .getPublicUrl(cartItem.asset.thumbnailPath).data.publicUrl
                : "/assets/noImage.svg";
                return <Image
                src={thumbnailUrl}
                alt={cartItem.asset.name}
                fill
                className="object-cover"
              />
            })}
        </div>
    )
}