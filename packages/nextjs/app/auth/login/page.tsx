"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserAuthForm } from "~~/components/ui/userauthform";

export default function Login() {
  return (
    <>
      <UserAuthForm />
    </>
  );
}
