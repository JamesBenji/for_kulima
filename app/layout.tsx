import HeaderAuth from "@/components/header-auth";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import { ArrowUpRight, CircleArrowOutUpRight } from "lucide-react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Home | Kulima",
  description: "Welcome to Kulima",
};

const poppins = Poppins({ subsets: ["latin"], weight: "400", style: "normal" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center ">
              {" "}
              {/**gap-20 removed */}
              <nav className=" w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full md:max-w-5xl flex justify-between items-center md:p-3 md:px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold  rounded-md">
                    <Link href={`/`} className="text-xl md:text-2xl px-5 md:px-0 flex align-text-bottom">
                      Kulima
                      <ArrowUpRight size={14} strokeWidth={3} className=""/>
                    </Link>
                  </div>
                  <HeaderAuth />
                </div>
              </nav>

              <div className="flex-1 flex flex-col relative flex-grow  w-full">
                {children}
              </div>

              <Footer />
            </div>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
