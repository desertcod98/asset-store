import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface CartItem{
    assetId: number,
    price: number
}



export const useCart = () => {
    const queryClient = useQueryClient();
    const get = useQuery({queryKey: ['cart'], queryFn: getAssetsInCart})
    const addAsset = useMutation({
        mutationFn: (assetId: number) => { return fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify({assetId}),
        }).then((res) => res.json())},
        onSuccess: (data: CartItem) => {
            const oldData = queryClient.getQueryData<CartItem[]>(['cart']);
            if(oldData){
                queryClient.setQueryData<CartItem[]>(['cart'], [...oldData, data])
            }else{
                queryClient.setQueryData<CartItem[]>(['cart'], [data])
            }
            toast.success("Item added to cart.")
        },
        onError: () => toast.error("Error adding item to cart.")
    })
    const removeAsset = useMutation({
        mutationFn: (assetId: number) => {
            return fetch("/api/cart?assetId="+assetId, {
                method: "DELETE",
            }).then((res) => res.json())
        },
        onSuccess: (data: CartItem) => {
            const oldData = queryClient.getQueryData<CartItem[]>(['cart']);
            if(oldData){
                const newData = oldData.filter(item => item.assetId !== data.assetId);
                queryClient.setQueryData<CartItem[]>(['cart'], newData);
                toast.success("Item removed from cart.")
            }
        }
    })
    return {
    get,
    addAsset,
    removeAsset,
}}


async function getAssetsInCart(){
    const res = await fetch("/api/cart");
    const json: CartItem[] = await res.json();
    return json;
}

