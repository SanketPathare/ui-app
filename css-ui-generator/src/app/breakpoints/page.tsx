"use client";

import { Shell } from "@/components/shell";
import { BreakpointGenerator } from "@/components/generators/breakpoint-generator";

export default function BreakpointsPage() {
  return (
    <Shell>
      <BreakpointGenerator />
    </Shell>
  );
}
