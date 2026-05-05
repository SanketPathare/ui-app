import { Shell } from "@/components/shell";
import { TailwindGenerator } from "@/components/generators/tailwind-generator";

export const metadata = {
  title: "Tailwind CSS Generator | UI Engine",
  description: "Build custom Tailwind utility combinations for complex UI components.",
};

export default function TailwindGenPage() {
  return (
    <Shell>
      <TailwindGenerator />
    </Shell>
  );
}
