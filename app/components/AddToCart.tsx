"use client";

import Button from "./Button";
import Image from "next/image";
import Spinner from "./Spinner";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCart } from "@/hooks/useCart";

export default function AddToCart({assetId}: {assetId: number}) {
  const session = useSession();
  const router = useRouter()
  const cart = useCart();

  function addToCart(){
    console.log(cart.get.data)
    if(session.status !== "authenticated"){
      router.push("/login");
    }
    cart.addAsset.mutate(assetId);
  }

  return (
    <div className="absolute right-2 bottom-2">
      {!cart.addAsset.isLoading ? (
        <Button onClick={addToCart}>
          <span className="text-lg">+</span>
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