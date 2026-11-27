import { Shell } from "@/components/shell";
import { CubicBezierGenerator } from "@/components/generators/cubic-bezier-generator";

export const metadata = {
  title: "Cubic Bezier Generator | UI Engine",
  description: "Design custom CSS easing curves and compare motion timing in real time.",
};

export default function CubicBezierPage() {
  return (
    <Shell>
      <CubicBezierGenerator />
    </Shell>
  );
}
