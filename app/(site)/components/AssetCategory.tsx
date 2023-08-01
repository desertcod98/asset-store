import Image from "next/image";

export default function AssetCategory({id, name, imagePath} : {id: number; name: string; imagePath: string} ){
  return (
    <div className="w-16 h-16 border-2 border-gray-600 rounded flex flex-col items-center cursor-pointer 
      group
    ">
      <Image
        className="group-hover:invert"
        src={"/assetCategories/"+imagePath}
        alt={"Category: "+name}
        width={35}
        height={35}
      />
      <span>{name}</span>
    </div>
  )
}