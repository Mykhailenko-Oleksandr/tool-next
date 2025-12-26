import Image from "next/image";
import { ChangeEvent, useState, useEffect, useRef } from "react";
import css from "./ImagePicker.module.css";

type Props = {
  onChangeImage: (file: File | null) => void;
  imageUrl?: string;
};

export default function ImagePicker({ imageUrl, onChangeImage }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (imageUrl) {
      setPreviewUrl(imageUrl);
    }
  }, [imageUrl]);

  function handleClickBtn() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setError("");

    if (!file) {
      setError("Фото інструменту обов'язкове");
    }

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Оберіть зображення");
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        setError("Розмір файлу не може перевищувати 1 МБ");
        return;
      }

      onChangeImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className={css.formGroup}>
      <label htmlFor="images" className={css.formLabel}>
        Фото інструменту
      </label>
      <div className={css.imageUpload}>
        <input
          ref={fileInputRef}
          type="file"
          id="images"
          name="images"
          accept="image/*"
          onChange={handleFileChange}
          className={css.fileInput}
        />
        {previewUrl ? (
          <div className={css.imagePreview}>
            <label htmlFor="images">
              <Image
                src={previewUrl}
                alt="Прев'ю"
                width={400}
                height={400}
                unoptimized
              />
            </label>
          </div>
        ) : (
          <>
            <label htmlFor="images" className={css.imagePlaceholder}></label>
          </>
        )}
        {error && <p className={css.errorMessage}>{error}</p>}
      </div>
      <button
        type="button"
        onClick={handleClickBtn}
        className={css.uploadButton}
      >
        Завантажити фото
      </button>
    </div>
  );
}
