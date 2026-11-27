import { Shell } from "@/components/shell";
import { ContrastCheckerGenerator } from "@/components/generators/contrast-checker-generator";

export const metadata = {
  title: "Contrast Checker | UI Engine",
  description: "Check WCAG 2.1 AA and AAA color contrast ratios in real time.",
};

export default function ContrastCheckerPage() {
  return (
    <Shell>
      <ContrastCheckerGenerator />
    </Shell>
  );
}
