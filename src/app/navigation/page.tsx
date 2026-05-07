"use client";

import { Shell } from "@/components/shell";
import { NavbarGenerator } from "@/components/generators/navbar-generator";

export default function NavigationPage() {
  return (
    <Shell>
      <NavbarGenerator />
    </Shell>
  );
}
