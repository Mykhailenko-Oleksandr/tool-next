// app/page.tsx
import Benefits from "@/components/Benefits/Benefits";
import FeaturedToolsBlock from "@/components/FeaturedToolsBlock/FeaturedToolsBlock";

export default async function HomePage() {
  // перший запит до API (серверна частина)
  const res = await fetch("http://localhost:3000/api/tools?page=1", {
    cache: "no-store", // щоб завжди брати свіжі дані
  });

  // const tools = await res.json();

  // Захист від HTML-404, щоб не падати на res.json()
  const tools = res.ok ? await res.json() : [];

  return (
    <main>
      <Benefits />
      <FeaturedToolsBlock tools={tools} />
    </main>
  );
}
