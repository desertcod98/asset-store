import Image from "next/image";
import Link from "next/link";

export default function AssetCategory({id, name, imagePath} : {id: number; name: string; imagePath: string} ){
  return (
    <Link className="w-16 h-16 border-2 border-gray-600 rounded flex flex-col items-center cursor-pointer 
      group hover:bg-gray-600 active:opacity-80 select-none
    "
      href={"/category/"+name}
    >
      <Image
        className="group-hover:invert"
        src={"/assetCategories/"+imagePath}
        alt={"Category: "+name}
        width={35}
        height={35}
      />
      <span className="group-hover:invert">{name}</span>
    </Link>
  )
}