import { Shell } from "@/components/shell";
import { HtmlToTailwind } from "@/components/generators/html-to-tailwind";

export const metadata = {
  title: "HTML to Tailwind Converter | UI Engine",
  description: "Convert raw HTML with inline styles to clean Tailwind CSS classes.",
};

export default function HtmlToTwPage() {
  return (
    <Shell>
      <HtmlToTailwind />
    </Shell>
  );
}
