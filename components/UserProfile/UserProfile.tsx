import css from "./UserProfile.module.css";
import Image from "next/image";
import { UserByIdResponse } from "@/lib/api/serverApi";
import { User } from "@/types/user";

interface UserProfileProps {
  user: UserByIdResponse | User;
}

const UserProfile = ({ user }: UserProfileProps) => {
  const displayName = user.name.trim();

  return (
    <div className={css.userProfileContainer}>
      <div className={css.letterAvatar}>
        <Image
          className={css.avatar}
          src={user.avatarUrl}
          width={128}
          height={128}
          alt="Avatar"
          priority
        />
      </div>

      <h3 className={css.userName}>{displayName}</h3>
    </div>
  );
};

export default UserProfile;
