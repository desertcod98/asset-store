"use client";

import { toast } from "react-hot-toast";
import Button from "../Button";
import { useRouter } from "next/navigation";

export default function CheckoutButton(){
  const router = useRouter();

  function checkout(){
    fetch("/api/checkout").then(res => {
      if(res.status!==200){
        res.text().then(data => toast.error(data));
      }else{
        res.json().then(json => router.push(json.sessionUrl))
      }
    })
  }

  return (
    <Button fullWidth height={"50px"} onClick={() => checkout()}>Checkout</Button>
  )
}