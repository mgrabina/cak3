"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "./ScaffoldEthAppWithProviders";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  BarChart,
  BuildingIcon,
  DollarSignIcon,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Users2,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import QRCode from "qrcode.react";
import { useAccount } from "wagmi";
import { BugAntIcon } from "@heroicons/react/24/outline";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~~/components/ui/breadcrumb";
import { Button } from "~~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~~/components/ui/dropdown-menu";
import { Input } from "~~/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~~/components/ui/sheet";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { Role, getRoleCredentialProofRequest } from "~~/utils/privadoId/identities";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  // Get current page
  const pathname = usePathname();

  const [investorQR, setInvestorQR] = useState<string | null>(null);
  const [founderQR, setFounderQR] = useState<string | null>(null);
  const [employeeQR, setEmployeeQR] = useState<string | null>(null);

  const { address } = useAccount();
  useEffect(() => {
    if (!address) return;

    getRoleCredentialProofRequest(address, "investor", "acme").then(req => {
      setInvestorQR(JSON.stringify(req));
    });

    getRoleCredentialProofRequest(address, "founder", "acme").then(req => {
      setFounderQR(JSON.stringify(req));
    });

    getRoleCredentialProofRequest(address, "employee", "acme").then(req => {
      setEmployeeQR(JSON.stringify(req));
    });
  }, [address]);

  const roleContext = useRole();

  const [polling, setPolling] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const checkRole = async () => {
    console.log("role", roleContext?.role);
    fetch("/api/role?address=" + address)
      .then(res => res.json())
      .then(data => {
        console.log("roles from backend: ", data);
        const dataRoles = data as {
          data: {
            role: Role;
          }[];
        };

        if (!dataRoles?.data || dataRoles?.data.length === 0) {
          return;
        }

        roleContext?.setRole({ ...roleContext, role: dataRoles?.data[0].role });
        setIsDialogOpen(false); // Close the dialog when role is set
      })
      .catch(error => {
        console.error("Error fetching roles: ", error);
      });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (polling) {
      checkRole(); // Check immediately
      interval = setInterval(checkRole, 2000); // Check every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [polling]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "text-foreground" : ""
              } group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base`}
            >
              <BuildingIcon className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              href="#"
              className={`${
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              } flex items-center gap-4 px-2.5  hover:text-foreground`}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>

            {roleContext?.role.role === "founder" && (
              <>
                <Link
                  href="/fundraising"
                  className={`${
                    pathname === "/fundraising" ? "text-foreground" : "text-muted-foreground"
                  } flex items-center gap-4 px-2.5  hover:text-foreground`}
                >
                  <DollarSignIcon className="h-5 w-5" />
                  Fundraising
                </Link>
                <Link
                  href="/holdings"
                  className={`${
                    pathname === "/holdings" ? "text-foreground" : "text-muted-foreground"
                  } flex items-center gap-4 px-2.5  hover:text-foreground`}
                >
                  <WalletIcon className="h-5 w-5" />
                  Holdings
                </Link>
                <Link
                  href="/payroll"
                  className={`${
                    pathname === "/payroll" ? "text-foreground" : "text-muted-foreground"
                  } flex items-center gap-4 px-2.5  hover:text-foreground`}
                >
                  <UsersIcon className="h-5 w-5" />
                  Payroll
                </Link>
                <Link
                  href="#"
                  className={`${
                    pathname === "/settings" ? "text-foreground" : "text-muted-foreground"
                  } flex items-center gap-4 px-2.5  hover:text-foreground`}
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      {roleContext?.role.role ? (
        <Badge variant="outline">{roleContext.role.role}</Badge>
      ) : !address ? (
        <Button disabled> Connect Wallet to unlock features</Button>
      ) : (
        <Dialog
          onOpenChange={open => {
            setPolling(!polling);
            setIsDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="default" className="float-right w-[150px]">
              Verify Identity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[800px]">
            <div className="text-md">Scan with the Polygon ID App</div>
            <div className="grid grid-cols-3 gap-10">
              <div className="cols-span-1">
                <div className="text-sm w-fit">Founder</div>
                <QRCode
                  // size={256}
                  height={200}
                  width={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={founderQR ?? ""}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <div className="cols-span-1">
                <div className="text-sm">Investor</div>
                <QRCode
                  // size={256}
                  height={200}
                  width={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={investorQR ?? ""}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <div className="cols-span-1">
                <div className="text-sm">Employee</div>
                <QRCode
                  // size={256}
                  height={200}
                  width={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={employeeQR ?? ""}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </div>
            {/* <DialogFooter>
              <Button className="w-full" onClick={checkRole}>
                Flow Succeed? Click here
              </Button>
            </DialogFooter> */}
          </DialogContent>
        </Dialog>
      )}
      <Breadcrumb></Breadcrumb>
      <div className="w-full flex items-center justify-end">
        <div className="relative ml-auto flex-1 md:grow-0">
          <ConnectButton></ConnectButton>
        </div>
      </div>
    </header>
  );
};
