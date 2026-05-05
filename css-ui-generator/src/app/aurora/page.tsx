import { Shell } from "@/components/shell";
import { AuroraGenerator } from "@/components/generators/aurora-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aurora Background Generator | CSS UI Engine",
  description: "Create mesmerizing, animated aurora borealis effects.",
};

export default function AuroraPage() {
  return (
    <Shell>
      <AuroraGenerator />
    </Shell>
  );
}
