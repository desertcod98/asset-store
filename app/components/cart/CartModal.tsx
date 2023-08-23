"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import CloseCart from "./CloseCart";
import { useCart } from "@/hooks/useCart";
import CartItem from "./CartItem";
import CheckoutButton from "./CheckoutButton";

interface CartModalProps{
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CartModal({isOpen, setIsOpen} : CartModalProps){
  const cart = useCart();

    return (
        // Use the `Transition` component at the root level
        <Transition show={isOpen} as={Fragment}>
          <Dialog onClose={() => setIsOpen(false)} className = "relative z-50">
            {/*
              Use one Transition.Child to apply one transition to the backdrop...
            */}
            <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            
                <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl dark:border-neutral-700 dark:bg-black/80 dark:text-white md:w-[410px]">
                <div className = "flex flex-col h-full w-full items-center">
                    <div className = "flex flex-row w-full h-30 justify-between items-center">
                        <h1 className = "text-3xl">
                            Cart
                        </h1>
                        <CloseCart closeCart={() => setIsOpen(false)}/>
                    </div>
                    <div className="my-4 overflow-y-auto flex-1 flex flex-col items-center gap-4 w-full">
                      {cart.get.data && cart.get.data.map((cartItem) => {
                        return <CartItem key={cartItem.asset.id} cartItem={cartItem}/> 
                      })}
                    </div>
                    <div className="flex flex-row w-full h-32 items-center mb-5">
                      {/* TODO make this a component */}
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex justify-between w-full p-2 border-b-2">
                          <span>Taxes</span>
                          <span>Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between w-full p-2 border-b-2">
                          <span>Shipping</span>
                          <span>Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between w-full p-2 border-b-2">
                          <span>Price</span>
                          <span>{cart.get.data ? cart.get.data?.reduce((i, current) => i+=current.price, 0)/100 : 0}$</span>
                        </div>
                      </div>
                    </div>
                    <CheckoutButton/>
                </div>

              </Dialog.Panel>
                
             
            </Transition.Child>
          </Dialog>
        </Transition>
      )
}