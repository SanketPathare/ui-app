import { Shell } from "@/components/shell";
import { BorderRadiusGenerator } from "@/components/generators/border-radius-generator";

export const metadata = {
  title: "Border Radius Generator | Modern CSS UI",
  description: "Create smooth, organic shapes by tweaking individual corner radii.",
};

export default function BorderRadiusPage() {
  return (
    <Shell>
      <BorderRadiusGenerator />
    </Shell>
  );
}
