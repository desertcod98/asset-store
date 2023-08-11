import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "./context/AuthContext";
import ToasterContext from "./context/ToasterContext";
import "./globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({weight: "400", subsets: ['latin'],});
const queryClient = new QueryClient()

export const metadata = {
  title: "nextjs-boilerplate",
  description: "nextjs-boilerplate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AuthContext>
          <ToasterContext />
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AuthContext>
      </body>
    </html>
  );
}
