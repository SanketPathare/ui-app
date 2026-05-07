import { Shell } from "@/components/shell";
import { ButtonGenerator } from "@/components/generators/button-generator";

export const metadata = {
  title: "Button Generator | Modern CSS UI",
  description: "Create stunning call-to-action buttons with custom typography and spacing.",
};

export default function ButtonPage() {
  return (
    <Shell>
      <ButtonGenerator />
    </Shell>
  );
}
