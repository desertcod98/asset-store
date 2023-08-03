import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized: ({token}) => token?.role === "ADMIN", 
  }
});

export const config = {
  matcher: ["/admin"],
};
