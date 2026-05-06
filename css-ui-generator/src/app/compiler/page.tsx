import { Shell } from "@/components/shell";
import { HtmlCompiler } from "@/components/generators/html-compiler";

export const metadata = {
  title: "Online HTML Compiler | UI Engine",
  description: "A high-performance live editing environment for rapid HTML5 prototyping and real-time visualization.",
};

export default function CompilerPage() {
  return (
    <Shell>
      <HtmlCompiler />
    </Shell>
  );
}
