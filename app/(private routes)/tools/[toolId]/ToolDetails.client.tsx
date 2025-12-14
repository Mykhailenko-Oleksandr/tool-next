"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import { api } from "@/app/api/api";
import { Tool } from "@/types/tool";
import AuthRequiredModal from "@/components/AuthRequiredModal/AuthRequiredModal";
import css from "./ToolDetailsPage.module.css";

async function fetchTool(toolId: string): Promise<Tool> {
    const response = await api.get(`/tools/${toolId}`);
    return response.data;
}

interface ToolDetailsClientProps {
    toolId: string;
}

export default function ToolDetailsClient({ toolId }: ToolDetailsClientProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const { data: tool, isLoading, error } = useQuery({
        queryKey: ["tool", toolId],
        queryFn: () => fetchTool(toolId),
    });

    const handleBookClick = () => {
        if (isAuthenticated) {
            router.push(`/tools/${toolId}/booking`);
        } else {
            setShowAuthModal(true);
        }
    };

    if (isLoading) {
        return (
            <main className={css.main}>
                <div className={`container ${css.container}`}>
                    <div className={css.loading}>Завантаження...</div>
                </div>
            </main>
        );
    }

    if (error || !tool) {
        return (
            <main className={css.main}>
                <div className={`container ${css.container}`}>
                    <div className={css.error}>
                        Помилка завантаження інструменту. Спробуйте пізніше.
                    </div>
                </div>
            </main>
        );
    }

    return (
        <>
            <main className={css.main}>
                <div className={`container ${css.container}`}>
                    <div className={css.content}>
                        {/* Tool Image */}
                        <div className={css.imageWrapper}>
                            {tool.images && tool.images.length > 0 ? (
                                <Image
                                    src={tool.images[0]}
                                    alt={tool.name}
                                    width={600}
                                    height={400}
                                    className={css.image}
                                    priority
                                />
                            ) : (
                                <div className={css.placeholderImage}>
                                    Немає зображення
                                </div>
                            )}
                        </div>

                        {/* Tool Details */}
                        <div className={css.details}>
                            <h1 className={css.title}>{tool.name}</h1>
                            <p className={css.price}>{tool.price} грн/день</p>

                            {/* Owner Information */}
                            <div className={css.ownerBlock}>
                                <div className={css.ownerInfo}>
                                    {tool.owner.avatar ? (
                                        <Image
                                            src={tool.owner.avatar}
                                            alt={tool.owner.username}
                                            width={48}
                                            height={48}
                                            className={css.ownerAvatar}
                                        />
                                    ) : (
                                        <div className={css.ownerAvatarPlaceholder}>
                                            {tool.owner.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className={css.ownerDetails}>
                                        <p className={css.ownerName}>{tool.owner.username}</p>
                                        <Link
                                            href={`/profile/${tool.owner.id}`}
                                            className={css.profileLink}
                                        >
                                            Переглянути профіль
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className={css.section}>
                                <p className={css.description}>{tool.description}</p>
                            </div>

                            {/* Technical Specifications */}
                            <div className={css.section}>
                                <h2 className={css.sectionTitle}>Технічні характеристики</h2>
                                <ul className={css.specsList}>
                                    {Object.entries(tool.specifications).map(([key, value]) => (
                                        <li key={key} className={css.specsListItem}>
                                            <span className={css.specKey}>{key}:</span>
                                            <span className={css.specValue}>{value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Rental Conditions */}
                            <div className={css.section}>
                                <h2 className={css.sectionTitle}>Умови оренди</h2>
                                <p className={css.rentalConditions}>{tool.rentalConditions}</p>
                            </div>

                            {/* Book Button */}
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
            </main>

            {showAuthModal && (
                <AuthRequiredModal onClose={() => setShowAuthModal(false)} />
            )}
        </>
    );
}

