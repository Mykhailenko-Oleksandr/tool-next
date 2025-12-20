import UserProfile from "@/components/UserProfile/UserProfile";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import { getMe, getMyTools } from "@/lib/api/serverApi";
import { redirect } from "next/navigation";
import css from './ProfilePage.module.css';
import { Metadata } from "next";
import ProfilePlaceholder from "@/components/ProfilePlaceholder/ProfilePlaceholder";


export async function generateMetadata(): Promise<Metadata> {
  const user = await getMe();

  if (!user) {
    return { title: 'Профіль' };
  }

  return {
    title: `Профіль ${user.name} | ToolNext`,
    description: "",
    robots: { index: false, follow: false }, 
  };
}

const ProfilePage = async () => {
  const user = await getMe();


  if (!user) {
    redirect('/'); 
  }

  const tools = await getMyTools();

  return (
    <>
     
      <UserProfile
        user={{
          name: user.name
        }}
       
      />
       <div className="container">
       <div className={css.titleWrap}>
        <h2 className={css.profileToolsTitle}>
          Інструменти
        </h2>
        </div>
      </div>
    
       {tools.length > 0 ? (  
         <ToolGrid tools={tools} />  
       ) : (  
         <ProfilePlaceholder />
       )} 
    </>
  );
};

export default ProfilePage;