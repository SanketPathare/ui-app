import { HtmlCompiler } from "@/components/generators/html-compiler";

export const metadata = {
  title: "HTML Compiler Online | UI Engine",
  description: "A VS Code-style live editing environment for HTML, CSS, and JS with real-time preview.",
};

export default function CompilerPage() {
  return <HtmlCompiler />;
}
