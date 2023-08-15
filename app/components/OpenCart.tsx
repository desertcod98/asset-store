"use client";
import Image from "next/image";
import CartModal from "./cart/CartModal";
import { useState } from "react";

export default function OpenCart(){
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <Image
            onClick={() => setIsOpen(true)}
            className="filter-[green] cursor-pointer"
            src={"/assets/cart.svg"}
            alt={"Cart icon"}
            width={25}
            height={25}
          />
          <CartModal isOpen={isOpen} setIsOpen={setIsOpen}/>
        </>
        
    )
}