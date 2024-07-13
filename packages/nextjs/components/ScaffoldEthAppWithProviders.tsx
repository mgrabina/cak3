"use client";

import React, { Dispatch, SetStateAction, useMemo } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { CustomSidebar } from "./Sidebar";
import { ToastProvider } from "./ui/toast";
import { Toaster } from "./ui/toaster";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BuildingIcon,
  DollarSignIcon,
  GitGraphIcon,
  GroupIcon,
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users2,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { WagmiProvider, useAccount } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~~/components/ui/tooltip";
// import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import Iden3AuthComponent from "~~/utils/privadoId/iden3component";
import { Role } from "~~/utils/privadoId/identities";

export type ContextType = {
  role: Role | undefined;
};

export type ContextActionsType = {
  role: ContextType;
  setRole: Dispatch<SetStateAction<ContextType>>;
};

const RoleContext = createContext<ContextActionsType | null>(null);

export const useRoleContext = () => useContext(RoleContext);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [roleContext, setRoleContext] = useState<ContextType>({
    role: undefined,
  });

  const { address } = useAccount();

  useEffect(() => {
    if (!address) {
      return;
    }

    fetch("/api/role?address=" + address)
      .then(res => res.json())
      // .then(data => console.log("roles from backend: ", data))
      .then(data => {
        const dataRoles = data as unknown as any;

        if (!dataRoles?.data || dataRoles?.data.length === 0) {
          return;
        }

        setRoleContext({ ...roleContext, role: dataRoles?.data[0].role });
      });
  }, [address]);

  const contextValue = useMemo(() => ({ role: roleContext, setRole: setRoleContext }), [roleContext, setRoleContext]);

  return <RoleContext.Provider value={contextValue}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  // useInitializeNativeCurrencyPrice();

  return (
    <>
      <RoleProvider>
        {/* <Iden3AuthComponent /> */}

        <div className="flex flex-col min-h-screen">
          <TooltipProvider>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
              <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <CustomSidebar></CustomSidebar>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                  </Tooltip>
                </nav>
              </aside>
              <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header></Header>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                  {children}
                  <Toaster></Toaster>
                </main>
              </div>
            </div>
          </TooltipProvider>

          {/* <Header /> */}
          {/* <main className="relative flex flex-col flex-1">{children}</main> */}
          {/* <Footer /> */}
        </div>
      </RoleProvider>
      {/* <Toaster /> */}
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar />
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
        >
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
