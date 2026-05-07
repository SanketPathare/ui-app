import { Shell } from "@/components/shell";
import { VariablesGenerator } from "@/components/generators/variables-generator";

export const metadata = {
  title: "CSS Variables Generator | Modern CSS UI",
  description: "Manage global design tokens and dynamic theme constants.",
};

export default function VariablesPage() {
  return (
    <Shell>
      <VariablesGenerator />
    </Shell>
  );
}
