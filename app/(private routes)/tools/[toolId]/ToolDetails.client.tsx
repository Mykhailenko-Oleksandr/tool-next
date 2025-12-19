"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./ToolDetailsPage.module.css";
import { fetchToolById } from "@/lib/api/clientApi";
import Loading from "@/app/loading";

interface ToolDetailsClientProps {
  toolId: string;
}

export default function ToolDetailsClient({ toolId }: ToolDetailsClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const {
    data: tool,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tool", toolId],
    queryFn: () => fetchToolById(toolId),
    refetchOnMount: false,
  });
  console.log("Tool data:", tool);
  const handleBookClick = () => {
    if (isAuthenticated) {
      router.push(`/tools/${toolId}/booking`);
    } else {
      setShowAuthModal(true);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !tool) {
    return (
      <section className={css.main}>
        <div className={"container"}>
          <div className={css.error}>
            Помилка завантаження інструменту. Спробуйте пізніше.
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className={css.main}>
        <div className="container">
          <div className={css.content}>
            <div className={css.imageWrapper}>
              {tool.images && tool.images.length > 0 ? (
                <Image
                  src={tool.images}
                  alt={tool.name}
                  width={600}
                  height={400}
                  className={css.image}
                  priority
                />
              ) : (
                <Image
                  src="/images/blank-image-mob.jpg"
                  alt={tool.name}
                  width={600}
                  height={400}
                  className={css.image}
                  priority
                />
              )}
            </div>

            <div className={css.details}>
              <h1 className={css.title}>{tool.name}</h1>
              <p className={css.price}>{tool.pricePerDay} грн/день</p>

              <div className={css.ownerBlock}>
                <div className={css.ownerInfo}>
                  {tool.owner.avatarUrl ? (
                    <Image
                      src={tool.owner.avatarUrl}
                      alt={tool.owner.name}
                      width={80}
                      height={80}
                      className={css.ownerAvatar}
                    />
                  ) : (
                    <div className={css.ownerAvatarPlaceholder}>
                      {tool.owner.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={css.ownerDetails}>
                    <p className={css.ownerName}>{tool.owner.name}</p>
                    <Link
                      href={`/profile/${tool.owner._id}`}
                      className={css.profileLink}
                    >
                      Переглянути профіль
                    </Link>
                  </div>
                </div>
              </div>

              <div className={css.section}>
                <p className={css.description}>{tool.description}</p>
              </div>

              <div className={css.section}>
                <ul className={css.specsList}>
                  {Object.entries(tool.specifications).map(([key, value]) => (
                    <li key={key} className={css.specsListItem}>
                      <span className={css.specKey}>{key}: </span>
                      <span className={css.specValue}>{value}</span>
                    </li>
                  ))}
                  <li className={css.section}>
                    <span className={css.specKey}>Умови оренди: </span>
                    <span className={css.specValue}>{tool.rentalTerms}</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={css.bookButton}
                onClick={handleBookClick}
              >
                Забронювати
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* {showAuthModal && (
        <AuthRequiredModal onClose={() => setShowAuthModal(false)} />
      )} */}
    </>
  );
}
