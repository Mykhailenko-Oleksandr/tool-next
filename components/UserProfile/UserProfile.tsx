import css from './UserProfile.module.css';

interface UserProfileProps {
  user: {
    name: string;
    tools?: unknown[];
  };
}

const UserProfile = ({ user }: UserProfileProps) => {
  const displayName = user.name.trim();
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="container">
      <div className={css.userProfileContainer}>
        <div className={css.letterAvatar}>
          {firstLetter}
        </div>

        <h1 className={css.userName}>
          {displayName}
        </h1>
      </div>

      <div className={css.titleWrap}>
        <h2 className={css.profileToolsTitle}>
          Інструменти
        </h2>
      </div>
    </div>
  );
};

export default UserProfile;