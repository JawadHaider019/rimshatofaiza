import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rimsha To Faiza",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://cdn.tailwindcss.com" async />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white antialiased overflow-hidden" suppressHydrationWarning>
        {children}
        <ClientStyles />
      </body>
    </html>
  );
}

// Move dynamic styles to a client component
function ClientStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      .font-cinematic { font-family: 'Playfair Display', serif; }
      .font-urdu { font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      body { background-color: black; color: white; overflow: hidden; }
    `}} />
  );
}