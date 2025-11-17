import React from "react";
import SpinToWinWheel from "./SpinToWinWheel";

const SpintowinPage = () => {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f7f6f2",
      }}
    >
      <SpinToWinWheel />
    </main>
  );
};
export default SpintowinPage;
