"use client";

import Button from "./Button";
import Image from "next/image";
import Spinner from "./Spinner";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddToCart({assetId}: {assetId: number}) {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter()

  function addToCart(){
    setIsLoading(true);
    if(session.status !== "authenticated"){
      router.push("/login");
    }
    
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
