import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Josefin_Sans } from 'next/font/google';
import './globals.css';

const spartan = localFont({
  src: '../public/fonts/Spartan-VariableFont_wght.ttf',
  variable: '--font-spartan',
});

const josefin = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Tarjouspyyntö',
  description: 'Lähetä tarjouspyyntö Nuuksion Taikaan',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi" className={`${spartan.variable} ${josefin.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
