"use client";

import Button from "./Button";
import Image from "next/image";
import Spinner from "./Spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/hooks/useCart";

export default function AddToCart(asset: CartItem) {
  const session = useSession();
  const router = useRouter()
  const cart = useCart();

  function addToCart(){
    if(session.status !== "authenticated"){
      router.push("/login");
    }
    cart.addAsset.mutate(asset);
  }

  function removeFromCart(){
    if(session.status !== "authenticated"){
      router.push("/login");
    }
    cart.removeAsset.mutate(asset.asset.id);
  }

  return (
    <>
      {(!cart.get.isLoading) ? (
        !cart.get.data?.some(item => item.asset.id === asset.asset.id) ?
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
    </>
  );
}