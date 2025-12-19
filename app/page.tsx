import FeedbacksBlock from '../components/FeedbacksBlock/FeedbacksBlock';
import RegistrationBlock from "@/components/RegistrationBlock/RegistrationBlock";
import Hero from "@/components/Hero/Hero";
import Benefits from "@/components/Benefits/Benefits";
import FeaturedToolsBlock from "@/components/FeaturedToolsBlock/FeaturedToolsBlock";
import { fetchPopularTool } from "@/lib/api/clientApi";

export default async function HomePage() {
  const res = await fetchPopularTool();
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
