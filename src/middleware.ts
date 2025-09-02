import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // unauthorized হলে এখানে redirect করবে
  },
  callbacks: {
    authorized: ({ token }) => {
      // token নেই বা role admin না → unauthorized
      return !!token && token.role === "admin";
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"], // শুধু /admin routes protect করবে
};
