import React, { ReactNode } from "react";
import Nav from "./nav";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
