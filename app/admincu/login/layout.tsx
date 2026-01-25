import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Kagitacraft",
  description: "Login ke admin panel Kagitacraft",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
