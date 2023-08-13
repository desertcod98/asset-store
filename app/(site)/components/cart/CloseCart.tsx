"use client";

import Image from "next/image"

interface CloseCartProps{
    closeCart: () => void
}

export default function CloseCart(props: CloseCartProps){
    return (
        <div className = "flex justify-center items-center p-3 cursor-pointer border-4 rounded-xl" onClick={props.closeCart}>
            <Image
                src = "/assets/x.svg"
                alt="Close cart"
                width={35}
                height={35}
            />
        </div>
    )
}