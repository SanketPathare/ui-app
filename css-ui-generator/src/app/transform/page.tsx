import { Shell } from "@/components/shell";
import { TransformGenerator } from "@/components/generators/transform-generator";

export const metadata = {
  title: "Transform Lab | Modern CSS UI",
  description: "Rotate, scale, and skew elements with 2D transformations.",
};

export default function TransformPage() {
  return (
    <Shell>
      <TransformGenerator />
    </Shell>
  );
}
