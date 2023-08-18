import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";


const f = createUploadthing();
 

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" , maxFileCount: 10
} })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");
      return {}
      // return {userId: session.user.id};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;