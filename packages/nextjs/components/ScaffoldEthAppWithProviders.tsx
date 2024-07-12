"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
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
import { WagmiProvider } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~~/components/ui/tooltip";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  // Get current page
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <TooltipProvider>
          <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
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
                {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <LineChart className="h-5 w-5" />
                      <span className="sr-only">Analytics</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Analytics</TooltipContent>
                </Tooltip> */}
              </nav>
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
              </main>
            </div>
          </div>
        </TooltipProvider>

        {/* <Header /> */}
        {/* <main className="relative flex flex-col flex-1">{children}</main> */}
        {/* <Footer /> */}
      </div>
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
