import { Shell } from "@/components/shell";
import { GlassmorphismGenerator } from "@/components/generators/glassmorphism-generator";

export const metadata = {
  title: "Glassmorphism Generator | Modern CSS UI",
  description: "Create the popular frosted glass effect with advanced filter controls.",
};

export default function GlassmorphismPage() {
  return (
    <Shell>
      <GlassmorphismGenerator />
    </Shell>
  );
}
