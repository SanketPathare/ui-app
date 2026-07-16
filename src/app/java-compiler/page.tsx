import { JavaCompilerGenerator } from "@/components/generators/java-compiler-generator";

export const metadata = {
  title: "Java Compiler | UI Engine",
  description:
    "Online Java compiler powered by CheerpJ. Write, compile, and run Java code in your browser with real-time output.",
};

export default function JavaCompilerPage() {
  return <JavaCompilerGenerator />;
}
