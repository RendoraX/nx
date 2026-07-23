import { QueryClientProvider } from '@tanstack/react-query';
import './globals.css'
import QueryProvider from '@/providers/queryProvider';
import { Toaster } from 'sonner';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}