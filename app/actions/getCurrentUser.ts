import { getServerSession } from "next-auth/next";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {authOptions} from "../api/auth/[...nextauth]/authOptions";

export default async function getCurrentUser(){
  const session: any = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return null;
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  
  return user;
}
