import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className="light" style={{ colorScheme: "light" }}>
      <body className="antialiased bg-zinc-50 text-zinc-900">{children}</body>
    </html>
  );
}
