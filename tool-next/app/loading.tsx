import { BeatLoader } from "react-spinners";

export default function Loading() {
  return (
    <BeatLoader
      color="#333"
      cssOverride={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
      margin={5}
      size={20}
    />
  );
}
