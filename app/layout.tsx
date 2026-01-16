// app/layout.tsx

// 1. Metadata (This is a named export)
export const metadata = {
  title: 'Psalm3 | Institutional Trust Protocol',
  description: "Psalm3 is the industry's security-first alliance layer and institutional trust protocol, bridging high-signal builders with elite ecosystem partners.",
  icons: {
    icon: '/favicon.ico', 
  },
  // ... rest of your openGraph config
};

// 2. The Default Export (This is what Vercel is looking for)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}