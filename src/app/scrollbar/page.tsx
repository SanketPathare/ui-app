import { Shell } from "@/components/shell";
import { ScrollbarGenerator } from "@/components/generators/scrollbar-generator";

export const metadata = {
  title: "Scrollbar Studio | UI Engine",
  description: "Customize cross-browser CSS scrollbars with live interactive preview.",
};

export default function ScrollbarPage() {
  return (
    <Shell>
      <ScrollbarGenerator />
    </Shell>
  );
}
