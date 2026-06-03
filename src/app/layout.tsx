import type { ReactNode } from "react";

export const metadata = {
  title: "Loyalty Platform",
  description: "WhatsApp-native loyalty for small businesses",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
