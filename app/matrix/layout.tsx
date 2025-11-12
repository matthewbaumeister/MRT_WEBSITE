"use client";

import { usePathname } from "next/navigation";

export default function MatrixLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isKnowledgeBase = pathname?.includes("/knowledge-base");

  // Knowledge Base needs normal scrolling, main Matrix page needs fixed layout
  if (isKnowledgeBase) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen overflow-hidden">
      {children}
    </div>
  );
}

