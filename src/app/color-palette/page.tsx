import { Shell } from "@/components/shell";
import { ColorPaletteGenerator } from "@/components/generators/color-palette-generator";

export const metadata = {
  title: "Color Palette Engine | Professional Color System",
  description: "High-fidelity color palette generator with Tailwind CSS integration and multi-format exports.",
};

export default function ColorPalettePage() {
  return (
    <Shell>
      <ColorPaletteGenerator />
    </Shell>
  );
}
