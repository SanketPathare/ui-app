import { Shell } from "@/components/shell";
import { CursorGenerator } from "@/components/generators/cursor-generator";

export const metadata = {
  title: "Cursor Effect Generator | UI Engine",
  description: "Design immersive custom mouse followers and cursor rings.",
};

export default function CursorPage() {
  return (
    <Shell>
      <CursorGenerator />
    </Shell>
  );
}
