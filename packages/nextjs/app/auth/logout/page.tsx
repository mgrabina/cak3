"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Web3AuthContext } from "../../layout";

export default function Logout() {
  const router = useRouter();

  const web3auth = React.useContext(Web3AuthContext);

  const succesfulLogout = async () => {
    await web3auth.logout();
    router.push("/auth/login");
  };

  return (
    <div>
      <button
        onClick={() => {
          succesfulLogout();
        }}
      >
        Logout here
      </button>
    </div>
  );
}
