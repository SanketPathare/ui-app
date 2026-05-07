import { Shell } from "@/components/shell";
import { CssToTailwind } from "@/components/generators/css-to-tailwind";

export const metadata = {
  title: "CSS to Tailwind Converter | UI Engine",
  description: "Translate traditional CSS properties into equivalent Tailwind utilities.",
};

export default function CssToTwPage() {
  return (
    <Shell>
      <CssToTailwind />
    </Shell>
  );
}
