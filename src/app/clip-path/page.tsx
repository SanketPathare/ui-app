import { Shell } from "@/components/shell";
import { ClipPathGenerator } from "@/components/generators/clip-path-generator";

export const metadata = {
  title: "Clip-path Generator | UI Engine",
  description: "Design custom CSS clipping paths with ease.",
};

export default function ClipPathPage() {
  return (
    <Shell>
      <ClipPathGenerator />
    </Shell>
  );
}
