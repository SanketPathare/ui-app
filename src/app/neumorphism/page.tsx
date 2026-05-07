import { Shell } from "@/components/shell";
import { NeumorphismGenerator } from "@/components/generators/neumorphism-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neumorphism Generator | CSS UI Engine",
  description: "Create soft UI elements with realistic highlights and shadows.",
};

export default function NeumorphismPage() {
  return (
    <Shell>
      <NeumorphismGenerator />
    </Shell>
  );
}
