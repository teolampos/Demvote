import React from "react";
import "./globals.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body className="relative">{children}</body>
    </html>
  );
};

export default Layout;
