"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AssetToModerate({id, name} : {id: number, name: string}){
  const router = useRouter();

  function acceptAsset(){
    fetch("/api/moderate/", {
      method: "POST",
      body: JSON.stringify({assetId: id, state: "ACCEPTED"}),
    }).then(res => {
      if(res.status !== 200){
        res.text().then(err => toast.error(err));
      } else{
        toast.success("Asset accepted!");
        router.refresh();
      }
    })
  }
  
  return (
    <div onClick={() => acceptAsset()}>
      {name}
    </div>
  )
}