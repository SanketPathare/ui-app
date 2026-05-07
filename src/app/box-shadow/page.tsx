import { Shell } from "@/components/shell";
import { BoxShadowGenerator } from "@/components/generators/box-shadow-generator";

export const metadata = {
  title: "Box Shadow Generator | Modern CSS UI",
  description: "Design perfect elevations and depth with customizable box shadows.",
};

export default function BoxShadowPage() {
  return (
    <Shell>
      <BoxShadowGenerator />
    </Shell>
  );
}
