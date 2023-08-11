"use client";

import Button from "./Button";
import Image from "next/image";
import Spinner from "./Spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

export default function AddToCart({assetId, price}: {assetId: number; price: number}) {
  const session = useSession();
  const router = useRouter()
  const cart = useCart();

  function addToCart(){
    if(session.status !== "authenticated"){
      router.push("/login");
    }
    cart.addAsset.mutate({assetId, price});
  }

  function removeFromCart(){
    if(session.status !== "authenticated"){
      router.push("/login");
    }
    cart.removeAsset.mutate(assetId);
  }

  return (
    <div className="absolute right-2 bottom-2">
      {(!cart.get.isLoading) ? (
        !cart.get.data?.some(item => item.assetId === assetId) ?
        (<Button onClick={addToCart}>
          <span className="text-lg">+</span>
          <Image
            src={"/assets/cart.svg"}
            alt="Add to cart image"
            width={20}
            height={20}
          />
        </Button>)
        :<Button onClick={removeFromCart} danger>
        <span className="text-lg">-</span>
        <Image
          src={"/assets/cart.svg"}
          alt="Add to cart image"
          width={20}
          height={20}
        />
      </Button>
      ) : (
        <Spinner />
      )}
    </div>
  );
}