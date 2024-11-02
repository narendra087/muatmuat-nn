import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";

import { Box } from "@mui/material";

import Header from "./components/_partials/Header";
import Sidebar from "./components/_partials/Sidebar";

export const metadata: Metadata = {
  title: "Product Page - NN",
  description: "Muat Muat - NN",
};

const StoreProvider = dynamic(() => import("./store/StoreProvider"), {
  ssr: false
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Header />
          <Box className="flex" sx={{ flexDirection: 'row' }}>
            <Sidebar />
            <Box sx={{ minHeight: "calc(100dvh - 70px)", width: "100%" }}>
              {children}
            </Box>
          </Box>
        </StoreProvider>
      </body>
    </html>
  );
}
