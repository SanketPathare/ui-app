import { Shell } from "@/components/shell";
import { MeshGradientGenerator } from "@/components/generators/mesh-gradient-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesh Gradient Generator | CSS UI Engine",
  description: "Create beautiful, fluid gradients by layering multiple radial points.",
};

export default function MeshGradientPage() {
  return (
    <Shell>
      <MeshGradientGenerator />
    </Shell>
  );
}
