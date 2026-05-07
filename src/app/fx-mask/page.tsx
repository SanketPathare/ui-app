import { Shell } from "@/components/shell";
import { MaskGenerator } from "@/components/generators/mask-generator";

export const metadata = {
  title: "CSS Mask Generator | Modern CSS UI",
  description: "Design advanced clipping and image masking effects.",
};

export default function MaskPage() {
  return (
    <Shell>
      <MaskGenerator />
    </Shell>
  );
}
