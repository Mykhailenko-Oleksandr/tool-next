"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <div
      style={{
        padding: "40px 0",
        textAlign: "center",
        fontSize: "14px",
      }}
    >
      <p style={{ marginBottom: 16 }}>
        Сталася помилка: {error.message}
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          padding: "10px 20px",
          borderRadius: 999,
          border: "none",
          background: "#6f2cff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Спробувати ще
      </button>
    </div>
  );
}
