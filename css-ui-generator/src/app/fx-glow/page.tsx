import { Shell } from "@/components/shell";
import { GlowGenerator } from "@/components/generators/glow-generator";

export const metadata = {
  title: "Glow Effect Generator | UI Engine",
  description: "Create atmospheric neon glows and ambient backlights.",
};

export default function GlowPage() {
  return (
    <Shell>
      <GlowGenerator />
    </Shell>
  );
}
