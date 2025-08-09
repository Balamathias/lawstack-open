import HomeComponent from "@/components/home";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="h-full">
      <Suspense>
        <HomeComponent />
      </Suspense>
    </div>
  );
}
