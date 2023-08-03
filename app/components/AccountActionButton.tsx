"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function AccountActionButton() {
  const session = useSession();

  if (session.status === "authenticated")
    return (
      <button onClick={() => signOut()}>
        <Image src={"/assets/logout.svg"} alt="logout" width={25} height={25} />
      </button>
    );
  else
    return (
      <Link href={"/login"}>
        <Image src={"/assets/login.svg"} alt="Login" width={25} height={25} />
      </Link>
    );
}
