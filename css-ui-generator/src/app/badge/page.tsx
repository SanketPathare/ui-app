"use client";

import { Shell } from "@/components/shell";
import { BadgeGenerator } from "@/components/generators/badge-generator";

export default function BadgePage() {
  return (
    <Shell>
      <BadgeGenerator />
    </Shell>
  );
}
