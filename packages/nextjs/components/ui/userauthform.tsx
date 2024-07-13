"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ScaffoldEthApp, { Web3AuthContext } from "../../app/layout";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { Button } from "~~/components/ui/button";
import { Icons } from "~~/components/ui/icons";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { cn } from "~~/lib/utils";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const router = useRouter();

  const web3auth = React.useContext(Web3AuthContext);

  const web3authconnect = async () => {
    try {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "google",
      });
      console.log("connected wallet", web3auth.getUserInfo());
    } catch (error) {
      console.log("failed to connect wallet", error);
    }
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <ScaffoldEthApp>
      <div className={cn("grid gap-6 w-4/12", className)} {...props}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <Button
              disabled={isLoading}
              onClick={() => {
                web3authconnect();
              }}
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Sign In with Email
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button variant="outline" type="button" disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
      </div>
    </ScaffoldEthApp>
  );
}
