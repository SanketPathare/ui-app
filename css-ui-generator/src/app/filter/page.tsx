import { Shell } from "@/components/shell";
import { FilterGenerator } from "@/components/generators/filter-generator";

export const metadata = {
  title: "Filter Core | Modern CSS UI",
  description: "Apply cinematic blurring and color shift filters.",
};

export default function FilterPage() {
  return (
    <Shell>
      <FilterGenerator />
    </Shell>
  );
}
