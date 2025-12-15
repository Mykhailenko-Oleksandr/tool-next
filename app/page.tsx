// app/page.tsx
import RegistrationBlock from "@/components/RegistrationBlock/RegistrationBlock";
import Hero from "@/components/Hero/Hero";
import Benefits from "@/components/Benefits/Benefits";
import FeaturedToolsBlock from "@/components/FeaturedToolsBlock/FeaturedToolsBlock";
import { Tool } from "@/types/tool";

export default async function HomePage() {
  // Запит до API
  const res = await fetch("http://localhost:3000/api/tools?page=1", {
    cache: "no-store",
  });

  // Очікуємо, що API повертає об’єкт { tools: Tool[], page: number, totalPages: number }
  const data = res.ok ? await res.json() : { tools: [] };

  // Дістаємо саме масив інструментів
  const tools: Tool[] = Array.isArray(data) ? data : (data.tools ?? []);

  console.log("tools:", tools, Array.isArray(tools));

  return (
    <>
      <Hero />
      <Benefits />
      <FeaturedToolsBlock tools={tools} />
      <RegistrationBlock />
    </>
  );
}
