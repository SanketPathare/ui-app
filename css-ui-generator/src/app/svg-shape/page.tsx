import { Shell } from "@/components/shell";
import { SvgShapeGenerator } from "@/components/generators/svg-shape-generator";

export const metadata = {
  title: "SVG Shape Generator | UI Engine",
  description: "Create custom SVG shapes for modern web interfaces.",
};

export default function SvgShapePage() {
  return (
    <Shell>
      <SvgShapeGenerator />
    </Shell>
  );
}
