"use client";

interface Props {
  error: Error;
}

export default function Error({ error }: Props) {
  return <h1>Could not fetch note details. {error.message}</h1>;
}
