import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frost Portal",
  description: "B2B Partner Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
