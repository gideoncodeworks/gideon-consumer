import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gideon - Multi-Model AI Chat',
  description: 'Chat with Claude, GPT, Gemini, and more - all in one platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="m-0 p-0 overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
