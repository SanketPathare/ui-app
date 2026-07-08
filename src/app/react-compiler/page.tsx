import { ReactCompilerGenerator } from "@/components/generators/react-compiler-generator";

export const metadata = {
  title: "React Sandbox | UI Engine",
  description:
    "Online React JS compiler with terminal, npm package installation, and live preview. A full-featured sandbox environment.",
};

export default function ReactCompilerPage() {
  return <ReactCompilerGenerator />;
}
