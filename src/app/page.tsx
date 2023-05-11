import { Counter } from "@/components/counter";

export const runtime = "edge";

export default function Home() {
  return (
    <main className="bg-black min-h-screen flex justify-center items-center">
      <Counter />
    </main>
  );
}
