
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { create } from "zustand";

interface CartItem{
    assetId: number,
    price: number
}

const queryClient = useQueryClient();

const addAssetToCart = (asset: CartItem) => useMutation({
    mutationFn: () => fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify(asset),
    }).then((res) => res.json()),
    onSuccess: (data: CartItem) => {
        const oldData = queryClient.getQueryData<CartItem[]>(['cart']);
        if(oldData){
            queryClient.setQueryData<CartItem[]>(['cart'], [...oldData, data])
        }else{
            queryClient.setQueryData<CartItem[]>(['cart'], [data])
        }
    }
})

export const useCart = () => {return {
    get: () => useQuery({queryKey: ['cart'], queryFn: getAssetsInCart})
}}

const a = useCart().get();

async function getAssetsInCart(){
    const res = await fetch("/api/cart");
    const json: CartItem[] = await res.json();
    return json;
}

interface Cart {
    assets: CartItem[];
    addItem: (data: CartItem) => void;
    removeItem: (id: number) => void;
    removeAll: () => void;
}

const useCarta = create<Cart>((set, get) =>  ({
    assets: await getAssetsInCart(),
    addItem: (data: CartItem) => {
        const currentAssets = get().assets;
        const existingAsset = currentAssets.find((asset) => asset.assetId === data.assetId);

        if(existingAsset){
            return toast.error("Item already in cart");
        }
        
    }
}))