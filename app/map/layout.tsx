import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "상권 정보",
  description: "지도에서 상권 정보 조회",
};

export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
