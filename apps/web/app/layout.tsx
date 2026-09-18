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
      <body className="bg-[#FAF8F3] text-[#2B2B2B] overflow-x-hidden">
        <main className="pb-[calc(6.25rem+env(safe-area-inset-bottom))] lg:pb-0">
         <AuthProvider>
          <QueryProvider>
            <CartProvider>
              <Header />
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