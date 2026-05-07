import { Shell } from "@/components/shell";
import { PatternGenerator } from "@/components/generators/pattern-generator";

export const metadata = {
  title: "Patterns | Modern CSS UI",
  description: "Generate mathematical background patterns and textures.",
};

export default function PatternPage() {
  return (
    <Shell>
      <PatternGenerator />
    </Shell>
  );
}
