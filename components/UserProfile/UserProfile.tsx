import css from './UserProfile.module.css'

interface UserProfileProps {
  name: string;
}

const UserProfile = ({ name }: UserProfileProps) => {
  const displayName = name.trim();
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="container">
      <div className={css.userProfileContainer}>
        <div className={css.letterAvatar}>
          {firstLetter}
        </div>
        <h1 className={css.userName}>{displayName}</h1>
      </div>

      <div className={css.titleWrap}>
          <h2 className={css.profileToolsTitle}>Інструменти </h2>
        </div>
    </div>
  );
};

export default UserProfile;