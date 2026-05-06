import { Shell } from "@/components/shell";
import { GradientTextGenerator } from "@/components/generators/gradient-text-generator";

export const metadata = {
  title: "Gradient Text Generator | UI Engine",
  description: "Design stunning high-fidelity typography with multi-color gradients.",
};

export default function GradientTextPage() {
  return (
    <Shell>
      <GradientTextGenerator />
    </Shell>
  );
}
