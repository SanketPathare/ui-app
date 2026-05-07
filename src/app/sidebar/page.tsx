"use client";

import { Shell } from "@/components/shell";
import { SidebarGenerator } from "@/components/generators/sidebar-generator";

export default function SidebarPage() {
  return (
    <Shell>
      <SidebarGenerator />
    </Shell>
  );
}
