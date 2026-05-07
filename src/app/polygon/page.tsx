import { Shell } from "@/components/shell";
import { PolygonGenerator } from "@/components/generators/polygon-generator";

export const metadata = {
  title: "Polygon Generator | UI Engine",
  description: "Create custom multi-sided geometric shapes for your UI.",
};

export default function PolygonPage() {
  return (
    <Shell>
      <PolygonGenerator />
    </Shell>
  );
}
