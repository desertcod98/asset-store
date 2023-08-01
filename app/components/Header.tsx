import Image from "next/image"
import LogoutButton from "./LogoutButton"
import Link from "next/link"

export default function Header(){
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
        <input type="text" placeholder = "Search assets..." className="w-2/3 h-10 rounded border-2 px-2" />
        <div className="flex gap-1">
          <Image
              className="filter-[green]"
              src={"/assets/cart.svg"}
              alt={"Cart icon"}
              width={25}
              height={25}
            />
            <LogoutButton/>
        </div>
      </div>
    </div>
  )
}