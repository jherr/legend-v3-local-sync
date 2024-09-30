import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 text-2xl">
      <Link href="/basics">Basics</Link>
      <Link href="/form-immediate">Form Immediate</Link>
      <Link href="/form-with-deltas">Form With Deltas</Link>
      <Link href="/form-with-submit">Form With Submit</Link>
      <Link href="/form-factored">Form Factored</Link>
    </div>
  );
}
