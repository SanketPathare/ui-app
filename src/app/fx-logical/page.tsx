import { Shell } from "@/components/shell";
import { LogicalGenerator } from "@/components/generators/logical-generator";

export const metadata = {
  title: "Logical Properties Generator | Modern CSS UI",
  description: "RTL-ready layouts using margin-inline and padding-block.",
};

export default function LogicalPage() {
  return (
    <Shell>
      <LogicalGenerator />
    </Shell>
  );
}
