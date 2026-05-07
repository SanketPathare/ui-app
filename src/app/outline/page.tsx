import { Shell } from "@/components/shell";
import { OutlineGenerator } from "@/components/generators/outline-generator";

export const metadata = {
  title: "Outline Engine | Modern CSS UI",
  description: "Create precise component outlines and focus states.",
};

export default function OutlinePage() {
  return (
    <Shell>
      <OutlineGenerator />
    </Shell>
  );
}
