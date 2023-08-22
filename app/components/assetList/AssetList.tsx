import { IAsset } from "@/hooks/useCart";
import Asset from "../Asset";

export default function AssetList({assets}: {assets: IAsset[]}) {
  return (
    <div className="w-full h-full  flex-col items-center flex gap-10 mt-5">
      <div className="flex items-center">
        <span className="font-medium">{assets.length + " results"}</span>
      </div>
      <div className="w-3/4 flex gap-10 flex-wrap">
        {assets.map((asset) => {
          return <Asset key={asset.id} {...asset} />;
        })}
      </div>
    </div>
  );
}
