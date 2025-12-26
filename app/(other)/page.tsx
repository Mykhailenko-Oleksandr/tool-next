import Benefits from "@/components/Benefits/Benefits";
import FeaturedToolsBlock from "@/components/FeaturedToolsBlock/FeaturedToolsBlock";
import FeedbacksBlock from "@/components/FeedbacksBlock/FeedbacksBlock";
import Hero from "@/components/Hero/Hero";
import RegistrationBlock from "@/components/RegistrationBlock/RegistrationBlock";
import { fetchTools } from "@/lib/api/clientApi";

export default async function HomePage() {
  const res = await fetchTools({ sortBy: "rating", sortOrder: "desc" });
  const tools = res.tools;

  return (
    <>
      <Hero />
      <Benefits />
      <FeaturedToolsBlock tools={tools} />
      <FeedbacksBlock />
      <RegistrationBlock />
    </>
  );
}
