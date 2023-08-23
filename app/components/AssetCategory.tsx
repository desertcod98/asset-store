import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export default function AssetCategory({
  id,
  name,
  imagePath,
  selected,
}: {
  id: number;
  name: string;
  imagePath: string;
  selected?: boolean;
}) {
  return (
    <Link
    //   className="w-16 h-16 border-2 border-gray-600 rounded flex flex-col items-center cursor-pointer 
    //   group hover:bg-gray-600 active:opacity-80 select-none
    // "
      className={clsx("w-16 h-16 border-2 border-gray-600 rounded flex flex-col items-center group select-none",
        selected ? "bg-gray-600 cursor-default" : "cursor-pointer hover:bg-gray-600 active:opacity-80"
      )}
      href={"/category/" + name}
    >
      <Image
        className={clsx(selected ? "invert" : "group-hover:invert" )}
        src={"/assetCategories/" + imagePath}
        alt={"Category: " + name}
        width={35}
        height={35}
      />
      <span className={clsx(selected ? "invert" : "group-hover:invert" )}>{name}</span>
    </Link>
  );
}
