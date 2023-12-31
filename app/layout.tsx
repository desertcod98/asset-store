import AuthContext from "./context/AuthContext";
import { ReactQueryContext } from "./context/ReactQueryContext";
import ToasterContext from "./context/ToasterContext";
import "./globals.css";
import { Roboto } from "next/font/google";
import "@uploadthing/react/styles.css";

const roboto = Roboto({weight: "400", subsets: ['latin'],});


export const metadata = {
  title: "Asset store",
  description: "Download assets of any type created by the community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryContext>
    <html lang="en">
      <body className={roboto.className}>
      
        <AuthContext>
          <ToasterContext />
    
            {children}

        </AuthContext>
        
      </body>
    </html>
    </ReactQueryContext>
  );
}
