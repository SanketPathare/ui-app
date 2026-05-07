import { Shell } from "@/components/shell";
import { ClampGenerator } from "@/components/generators/clamp-generator";

export const metadata = {
  title: "CSS Clamp Generator | Modern CSS UI",
  description: "Calculate responsive fluid typography and spacing without media queries.",
};

export default function ClampPage() {
  return (
    <Shell>
      <ClampGenerator />
    </Shell>
  );
}
