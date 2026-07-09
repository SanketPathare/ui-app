import { PythonCompilerGenerator } from "@/components/generators/python-compiler-generator";

export const metadata = {
  title: "Python Compiler | UI Engine",
  description:
    "Online Python compiler powered by WebAssembly. Run Python code in your browser with support for NumPy and more.",
};

export default function PythonCompilerPage() {
  return <PythonCompilerGenerator />;
}