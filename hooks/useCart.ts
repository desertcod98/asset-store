
import { toast } from "react-hot-toast";
import { create } from "zustand";

interface CartItem{
    assetId: number,
    price: number
}

interface Cart {
    assets: CartItem[];
    addItem: (data: CartItem) => void;
    removeItem: (id: number) => void;
    removeAll: () => void;
}

const useCart = create<Cart>((set, get) =>  ({
    assets: await getAssetsInCart(),
    addItem: (data: CartItem) => {
        const currentAssets = get().assets;
        const existingAsset = currentAssets.find((asset) => asset.assetId === data.assetId);

        if(existingAsset){
            return toast.error("Item already in cart");
        }
        
    }
}))

async function getAssetsInCart(){
    const res = await fetch("/api/cart");
    const json: CartItem[] = await res.json();
    return json;
}