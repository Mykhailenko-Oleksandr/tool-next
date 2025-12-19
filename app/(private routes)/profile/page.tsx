import UserProfile from "@/components/UserProfile/UserProfile";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import { getMe } from "@/lib/api/serverApi";
import { notFound } from "next/navigation";



const ProfilePage = async () => {
  const user = await getMe();

  if (!user) {
    notFound(); // або notFound()
  }

  return (
    <>
     
      <UserProfile
        user={{
          name: user.name
        }}
       
      />

      {/* Інструменти */}
      {user.tools.length > 0 ? (
        <ToolGrid tools={user.tools} />
      ) : (
        <p>Інструментів поки немає</p>
        // або <ProfilePlaceholder />
      )}
    </>
  );
};

export default ProfilePage;