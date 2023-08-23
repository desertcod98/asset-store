"use client";

import { toast } from "react-hot-toast";
import Button from "../Button";

export default function CheckoutButton(){
  return (
    <Button fullWidth height={"50px"} onClick={() => toast.success("TODO checkout")}>Checkout</Button>
  )
}