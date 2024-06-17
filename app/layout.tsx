import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
};

export default Layout;
