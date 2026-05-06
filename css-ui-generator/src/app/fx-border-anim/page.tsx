import { Shell } from "@/components/shell";
import { BorderAnimGenerator } from "@/components/generators/border-anim-generator";

export const metadata = {
  title: "Border Animation Generator | UI Engine",
  description: "Design dynamic animated borders with moving gradients.",
};

export default function BorderAnimPage() {
  return (
    <Shell>
      <BorderAnimGenerator />
    </Shell>
  );
}
