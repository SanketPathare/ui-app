import { Shell } from "@/components/shell";
import { TextShadowGenerator } from "@/components/generators/text-shadow-generator";

export const metadata = {
  title: "Text Shadow Generator | Modern CSS UI",
  description: "Design layered typography shadows with ease.",
};

export default function TextShadowPage() {
  return (
    <Shell>
      <TextShadowGenerator />
    </Shell>
  );
}
