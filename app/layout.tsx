import HeaderAuth from "@/components/header-auth";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

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
                    <Link href={"/"} className="text-lg px-5 ">
                      Kulima
                    </Link>
                  </div>
                  <HeaderAuth />
                </div>
              </nav>

              <div className="flex-1 flex flex-col relative bg-white flex-grow  w-full ">
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