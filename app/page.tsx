// import RegistrationBlock from "@/components/RegistrationBlock/RegistrationBlock";
// import css from "./Home.module.css";
// import Hero from "@/components/Hero/Hero";
// import Benefits from "@/components/Benefits/Benefits";

// export default async function HomePage() {
//   // перший запит до API (серверна частина)
//   const res = await fetch("http://localhost:3000/api/tools?page=1", {
//     cache: "no-store", // щоб завжди брати свіжі дані
//   });

//   // const tools = await res.json();

//   // Захист від HTML-404, щоб не падати на res.json()
//   const tools = res.ok ? await res.json() : [];

//   return (
//     <>
//       <Hero />
//       <Benefits />
//       <RegistrationBlock />
//     </>
//   );
// }

// import RegistrationBlock from "@/components/RegistrationBlock/RegistrationBlock";
// import css from "./Home.module.css";
// import Hero from "@/components/Hero/Hero";
// import Benefits from "@/components/Benefits/Benefits";
// import FeaturedToolsBlock from "@/components/FeaturedToolsBlock/FeaturedToolsBlock";

// export default async function HomePage() {
//   // Запит до API
//   const res = await fetch("http://localhost:3000/api/tools?page=1", {
//     cache: "no-store",
//   });

//   const tools = res.ok ? await res.json() : [];

//   return (
//     <>
//       <Hero />
//       <Benefits />
//       <FeaturedToolsBlock tools={tools} /> {/* ✅ тепер змінна використовується */}
//       <RegistrationBlock />
//     </>
//   );
// }

import RegistrationBlock from "@/components/RegistrationBlock/RegistrationBlock";
// import css from "./Home.module.css";
import Hero from "@/components/Hero/Hero";
import Benefits from "@/components/Benefits/Benefits";
import FeaturedToolsBlock from "@/components/FeaturedToolsBlock/FeaturedToolsBlock";

export default async function HomePage() {
  // Запит до API
  const res = await fetch("http://localhost:3000/api/tools?page=1", {
    cache: "no-store",
  });

  const tools = res.ok ? await res.json() : [];
  console.log("tools:", tools, Array.isArray(tools));

  return (
    <>
      <Hero />
      <Benefits />
      <FeaturedToolsBlock tools={tools} />{" "}
      {/* ✅ тепер змінна використовується */}
      <RegistrationBlock />
    </>
  );
}
