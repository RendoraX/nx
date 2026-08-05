import { AuthProvider } from "@/providers/AuthProviders";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProviders";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CartProvider } from "@/providers/CartProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-[#FAF8F3] text-[#2B2B2B]">
        <main>
         <AuthProvider>
          <QueryProvider>
            <Header />
            <CartProvider>
              {children}
            </CartProvider>
            <Footer />
            <Toaster/>
          </QueryProvider>
         </AuthProvider>
        </main>
      </body>
    </html>
  );
}