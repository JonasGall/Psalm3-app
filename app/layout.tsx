// app/layout.tsx
import './globals.css'; // <--- CRITICAL: This imports your Tailwind/CSS design
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Psalm3 | Institutional Trust Protocol',
  description: "Psalm3 is the industry's security-first alliance layer and institutional trust protocol, bridging high-signal builders with elite ecosystem partners.",
  icons: {
    icon: '/favicon.ico', 
  },
  openGraph: {
    title: 'Psalm3 Protocol',
    description: 'The security-first alliance layer for Web3 builders.',
    url: 'https://psalm3.xyz',
    siteName: 'Psalm3',
    images: [{ url: 'https://psalm3.xyz/og-image.jpg' }],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}