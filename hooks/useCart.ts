import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface IAsset{
  id: number;
  name: string;
  created_at: Date;
  description: string;
  priceCents: number;
  assetCategoryId: number;
  authorId: string;
  thumbnailKey: string | null;
  thumbnailUrl: string | null;
  moderationId: number;
  author: {
      name: string;
  };
  assetFileKey: string;
  assetFileUrl: string;
};

export interface CartItem{
    asset: IAsset,
    price: number
}

export const useCart = () => {
    const queryClient = useQueryClient();
    const get = useQuery({queryKey: ['cart'], queryFn: getAssetsInCart})
    const addAsset = useMutation({
        mutationFn: (asset: CartItem) => { return fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify({assetId: asset.asset.id}),
        }).then((res) => res.json())},
        onMutate: async (asset: CartItem) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] })
            const previousCart = queryClient.getQueryData<CartItem[]>(['cart']);
            if(previousCart){
                queryClient.setQueryData<CartItem[]>(['cart'], [...previousCart, asset])
            }else{
                queryClient.setQueryData<CartItem[]>(['cart'], [asset])
            }
            return {previousCart: previousCart ?? []}
        },
        onError: (err, asset, context) => {
            toast.error("Error adding item to cart.")
            queryClient.setQueryData(['cart'], context?.previousCart ?? [])
        }
    })
    const removeAsset = useMutation({
        mutationFn: (assetId: number) => {
            return fetch("/api/cart?assetId="+assetId, {
                method: "DELETE",
            }).then((res) => res.json())
        },
        onMutate: async (assetId: number) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] })
            const previousCart = queryClient.getQueryData<CartItem[]>(['cart']);
            if(previousCart){
                const newData = previousCart.filter(item => item.asset.id !== assetId);
                queryClient.setQueryData<CartItem[]>(['cart'], newData);    
            }
            return {previousCart: previousCart ?? []}
        },
        onError: (err, assetId, context) => {
            toast.error("Error removing item from cart.")
            queryClient.setQueryData(['cart'], context?.previousCart ?? [])
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

