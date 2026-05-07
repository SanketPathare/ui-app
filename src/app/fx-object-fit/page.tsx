import { Shell } from "@/components/shell";
import { ObjectFitGenerator } from "@/components/generators/object-fit-generator";

export const metadata = {
  title: "Object Fit Generator | Modern CSS UI",
  description: "Perfectly align and scale images/videos within containers.",
};

export default function ObjectFitPage() {
  return (
    <Shell>
      <ObjectFitGenerator />
    </Shell>
  );
}
