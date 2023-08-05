import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized: ({token, req}) => {
      if(req.nextUrl.pathname === "/admin")
      return token?.role === "ADMIN"
      return token !== null
    }, 
  }
});

export const config = {
  matcher: ["/admin", "/upload"],
};
