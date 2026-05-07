import { Shell } from "@/components/shell";
import { OpacityGenerator } from "@/components/generators/opacity-generator";

export const metadata = {
  title: "Opacity Control | Modern CSS UI",
  description: "Master transparency and alpha transitions.",
};

export default function OpacityPage() {
  return (
    <Shell>
      <OpacityGenerator />
    </Shell>
  );
}
