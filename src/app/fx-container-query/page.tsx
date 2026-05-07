import { Shell } from "@/components/shell";
import { ContainerQueryGenerator } from "@/components/generators/container-query-generator";

export const metadata = {
  title: "Container Queries Generator | Modern CSS UI",
  description: "Style components based on their container size, not the viewport.",
};

export default function ContainerQueryPage() {
  return (
    <Shell>
      <ContainerQueryGenerator />
    </Shell>
  );
}
