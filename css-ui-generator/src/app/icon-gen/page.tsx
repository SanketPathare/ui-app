import { Shell } from "@/components/shell";
import { IconGenerator } from "@/components/generators/icon-generator";

export const metadata = {
  title: "Icon Lab Generator | UI Engine",
  description: "Design custom stylized icons for your web applications.",
};

export default function IconPage() {
  return (
    <Shell>
      <IconGenerator />
    </Shell>
  );
}
