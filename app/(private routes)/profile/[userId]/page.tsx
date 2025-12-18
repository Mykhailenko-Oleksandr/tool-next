import { notFound } from "next/navigation";

import UserProfile from "@/components/UserProfile/UserProfile";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import { getUserTools, mockUser } from "@/lib/api/serverApi";


// import { getUserById } from "@/lib/getUserById";

interface PageProps {
  params: {
    userId: string;
  };
}

export default async function ProfilePage({ params }: PageProps) {
  // 🔹 Поки використовуємо mock
  const user = mockUser;
  // 🔹 Потім буде так:
  // const user = await getUserTools(params.userId);

  if (!user) {
    notFound();
  }

  return (
    <>
      {/* Header профілю */}
      <UserProfile name={user.name} />

      {/* Інструменти */}
      {user.tools.length > 0 ? (
        
          <ToolGrid tools={user.tools} />
  
      ) : (
        <p>Інструментів поки немає</p>
        // or
        // <Placeholder />
      )}
    </>
  );
}