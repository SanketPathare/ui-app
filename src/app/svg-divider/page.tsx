import { Shell } from "@/components/shell";
import { SvgDividerGenerator } from "@/components/generators/svg-divider-generator";

export const metadata = {
  title: "SVG Divider Generator | UI Engine",
  description: "Create beautiful section dividers and wave transitions.",
};

export default function SvgDividerPage() {
  return (
    <Shell>
      <SvgDividerGenerator />
    </Shell>
  );
}
