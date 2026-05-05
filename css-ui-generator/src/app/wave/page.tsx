import { Shell } from "@/components/shell";
import { WaveGenerator } from "@/components/generators/wave-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG Wave Generator | CSS UI Engine",
  description: "Design smooth, organic SVG waves for section separators.",
};

export default function WavePage() {
  return (
    <Shell>
      <WaveGenerator />
    </Shell>
  );
}
