import Image from "next/image";
import AccountActionButton from "../AccountActionButton";
import Link from "next/link";
import OpenCart from "../OpenCart";
import SearchBar from "./Searchbar";

export default async function Header() {
  return (
    <div className="w-full h-28 border-b-2 flex justify-center">
      <div className="w-3/4 h-full  flex items-center gap-10">
        <Link className="flex gap-2 items-center cursor-pointer" href="/">
          <Image
            src={"/assets/image.svg"}
            alt={"Image icon"}
            width={60}
            height={60}
          />
          <h1 className="text-2xl">Asset store</h1>
        </Link>
        <SearchBar/>
        <div className="flex gap-4">
          <OpenCart />
          <Link href={"/upload"}>
            <Image
              src={"/assets/upload.svg"}
              alt="Upload asset"
              width={25}
              height={25}
            />
          </Link>
          <AccountActionButton />
        </div>
      </div>
    </div>
  );
}
