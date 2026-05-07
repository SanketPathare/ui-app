import { Shell } from "@/components/shell";
import { CurveShapeGenerator } from "@/components/generators/curve-shape-generator";

export const metadata = {
  title: "Curve Shape Generator | UI Engine",
  description: "Design smooth Bezier curves and organic fluid shapes.",
};

export default function CurveShapePage() {
  return (
    <Shell>
      <CurveShapeGenerator />
    </Shell>
  );
}
