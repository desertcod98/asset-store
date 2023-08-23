import { IAsset } from "../../../hooks/useCart";
import Asset from "../Asset";

export default function AssetList({assets, text}: {text?: string, assets: IAsset[]}) {
  return (
    <div className="w-full h-full  flex-col items-center flex gap-10 mt-5">
      <div className="flex items-center flex-col">
        {text && <span className="font-medium text-lg">{text}</span>}
        <span className="font-medium text-lg">{assets.length + " results"}</span>
      </div>
      <div className="w-3/4 flex gap-10 flex-wrap">
        {assets.map((asset) => {
          return <Asset key={asset.id} {...asset} />;
        })}
      </div>
    </div>
  );
}
