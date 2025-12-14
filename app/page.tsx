import RegistrationBlock from "@/components/RegistrationBlock/RegistrationBlock";
import css from "./Home.module.css";
import Hero from "@/components/Hero/Hero";
import Benefits from "@/components/Benefits/Benefits";


export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <RegistrationBlock />
    </>
  );
}
