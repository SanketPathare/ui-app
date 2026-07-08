import { Shell } from "@/components/shell";
import { BlobGenerator } from "@/components/generators/blob-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blob Shape Generator | UI Engine",
  description: "Generate organic, fluid SVG-like shapes using the border-radius property.",
};

export default function BlobPage() {
  return (
    <Shell>
      <BlobGenerator />
    </Shell>
  );
}
