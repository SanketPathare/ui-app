import { CSharpCompilerGenerator } from "@/components/generators/csharp-compiler-generator";

export const metadata = {
  title: "C# Compiler | UI Engine",
  description:
    "Online C# compiler powered by Blazor WebAssembly. Write, compile, and run C# code in your browser with real-time output.",
};

export default function CSharpCompilerPage() {
  return <CSharpCompilerGenerator />;
}