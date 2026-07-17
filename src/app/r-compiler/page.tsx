import { RCompilerGenerator } from "@/components/generators/r-compiler-generator";

export const metadata = {
  title: "R Compiler | UI Engine",
  description:
    "Online R compiler powered by WebAssembly and WebR. Write, run, and analyze R code directly in your browser.",
};

export default function RCompilerPage() {
  return <RCompilerGenerator />;
}
