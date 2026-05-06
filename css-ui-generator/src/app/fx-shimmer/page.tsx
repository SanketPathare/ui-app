import { Shell } from "@/components/shell";
import { ShimmerGenerator } from "@/components/generators/shimmer-generator";

export const metadata = {
  title: "Shimmer Effect Generator | UI Engine",
  description: "Create professional skeletal loading states and glossy shimmer animations.",
};

export default function ShimmerPage() {
  return (
    <Shell>
      <ShimmerGenerator />
    </Shell>
  );
}
