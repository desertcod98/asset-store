"use client";

import Button from "./Button";
import Image from "next/image";
import Spinner from "./Spinner";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sAddToCart } from "./actions";
import { toast } from "react-hot-toast";

export default function AddToCart({assetId}: {assetId: number}) {
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();
  const session = useSession();
  const router = useRouter()

  function addToCart(){
    setIsLoading(true);
    if(session.status !== "authenticated"){
      router.push("/login");
    }
    startTransition(async () => {
      try{
        await sAddToCart(assetId);
        setIsLoading(false);
        toast.success("Item added to cart");
      }catch(e : any){
        toast.error("Error while adding item to cart");
        setIsLoading(false);
      }
    })
  }

  return (
    <div className="absolute right-2 bottom-2">
      {!isLoading ? (
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
