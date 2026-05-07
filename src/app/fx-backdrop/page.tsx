import { Shell } from "@/components/shell";
import { BackdropFilterGenerator } from "@/components/generators/backdrop-filter-generator";

export const metadata = {
  title: "Backdrop Filter Generator | Modern CSS UI",
  description: "Frost glass effects and background blurs for premium UIs.",
};

export default function BackdropPage() {
  return (
    <Shell>
      <BackdropFilterGenerator />
    </Shell>
  );
}
