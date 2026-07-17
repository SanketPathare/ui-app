import { CppCompilerGenerator } from "@/components/generators/cpp-compiler-generator";

export const metadata = {
  title: "C++ Compiler | UI Engine",
  description:
    "Online C++ compiler powered by WebAssembly/Clang. Write, compile, and run C++ code in your browser with real-time output.",
};

export default function CppCompilerPage() {
  return <CppCompilerGenerator />;
}
