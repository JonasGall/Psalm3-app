// app/layout.tsx

export const metadata = {
  title: 'Psalm3 | Institutional Trust Protocol',
  description: "Psalm3 is the industry's security-first alliance layer and institutional trust protocol, bridging high-signal builders with elite ecosystem partners.",
  icons: {
    icon: '/favicon.ico.png', // Make sure you have a favicon in your /public folder
  },
  openGraph: {
    title: 'Psalm3 Protocol',
    description: 'The security-first alliance layer for Web3 builders.',
    url: 'https://psalm3.xyz',
    siteName: 'Psalm3',
    images: [
      {
        url: 'https://psalm3.xyz/og-image.jpg', // Path to your preview image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};