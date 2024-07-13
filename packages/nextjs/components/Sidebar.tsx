import React, { Dispatch, SetStateAction, useMemo } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
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
import { useRole } from "./ScaffoldEthAppWithProviders";

const CustomSidebar = () => {
  // Get current page
  const pathname = usePathname();

  const roleContext = useRole();

  return (
    <>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <BuildingIcon className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              className={`${
                pathname === "/" ? "bg-accent" : ""
              }  flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Home</TooltipContent>
        </Tooltip>
        {roleContext?.role.role === "founder" && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/fundraising"
                  className={`${
                    pathname === "/fundraising" ? "bg-accent" : ""
                  }  flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
                >
                  <DollarSignIcon className="h-5 w-5" />
                  <span className="sr-only">Fundraising</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Fundraising</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/holdings"
                  className={`${
                    pathname === "/holdings" ? "bg-accent" : ""
                  }  flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
                >
                  <WalletIcon className="h-5 w-5" />
                  <span className="sr-only">Holdings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Holdings</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/payroll"
                  className={`${
                    pathname === "/payroll" ? "bg-accent" : ""
                  }  flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
                >
                  <UsersIcon className="h-5 w-5" />
                  <span className="sr-only">Payroll</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Payroll</TooltipContent>
            </Tooltip>
          </>
        )}
      </nav>
    </>
  );
};

export { CustomSidebar };