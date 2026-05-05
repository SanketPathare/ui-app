import { Shell } from "@/components/shell";
import { GradientBorderGenerator } from "@/components/generators/gradient-border-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gradient Border Generator | CSS UI Engine",
  description: "Create elegant components with multi-color gradient borders.",
};

export default function GradientBorderPage() {
  return (
    <Shell>
      <GradientBorderGenerator />
    </Shell>
  );
}
