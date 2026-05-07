import { Shell } from "@/components/shell";
import { ScrollbarGenerator } from "@/components/generators/scrollbar-generator";

export const metadata = {
  title: "Custom Scrollbar Generator | UI Engine",
  description: "Design unique cross-browser scrollbar styles for a branded experience.",
};

export default function ScrollbarPage() {
  return (
    <Shell>
      <ScrollbarGenerator />
    </Shell>
  );
}
