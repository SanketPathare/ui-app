import { Shell } from "@/components/shell";
import { GradientGenerator } from "@/components/generators/gradient-generator";

export const metadata = {
  title: "Gradient Generator | Modern CSS UI",
  description: "Create beautiful linear and radial gradients for your web projects.",
};

export default function GradientPage() {
  return (
    <Shell>
      <GradientGenerator />
    </Shell>
  );
}
