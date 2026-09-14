import { Spotlight } from "@/components/ui/spotlight";
import Wizard from "@/components/Wizard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <div className="z-10 w-full max-w-lg p-6">
        <Wizard />
      </div>
    </main>
  );
}
