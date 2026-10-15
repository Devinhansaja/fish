import Link from "next/link";
import { FishIllustration } from "@/components/Underwater";
import { PrimaryCTA } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="on-dark grid min-h-[80svh] place-items-center bg-deep px-6 pt-32 text-center">
      <div>
        <div className="mx-auto w-40" style={{ animation: "swim-bob 5s ease-in-out infinite", ["--amp" as string]: "12px" }}>
          <FishIllustration color="#ffd166" fin="#ff7b63" className="h-auto w-full" />
        </div>
        <h1 className="h2 mt-8 text-white">This page swam away</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-white/85">We could not find the page you were looking for.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <PrimaryCTA href="/" arrow={false}>Back to home</PrimaryCTA>
          <Link href="/fish-collection" className="btn-ghost">Browse fish</Link>
        </div>
      </div>
    </section>
  );
}
