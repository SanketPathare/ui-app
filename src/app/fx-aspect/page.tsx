import { Shell } from "@/components/shell";
import { AspectRatioGenerator } from "@/components/generators/aspect-ratio-generator";

export const metadata = {
  title: "Aspect Ratio Generator | Modern CSS UI",
  description: "Control element proportions across all screen sizes with ease.",
};

export default function AspectRatioPage() {
  return (
    <Shell>
      <AspectRatioGenerator />
    </Shell>
  );
}
