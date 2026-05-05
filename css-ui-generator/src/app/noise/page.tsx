import { Shell } from "@/components/shell";
import { NoiseGenerator } from "@/components/generators/noise-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Noise Texture Generator | CSS UI Engine",
  description: "Generate procedural grain and noise textures using SVG filters.",
};

export default function NoisePage() {
  return (
    <Shell>
      <NoiseGenerator />
    </Shell>
  );
}
