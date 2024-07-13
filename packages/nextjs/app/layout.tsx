"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Login from "./auth/login/page";
import "@rainbow-me/rainbowkit/styles.css";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

<<<<<<< Updated upstream
export const metadata = getMetadata({
  title: "Cake",
  description: "All-in-one Financial Platform for Web3 Founder",
=======
type ScaffoldEthAppProps = {
  children: React.ReactNode;
};
// Initialize Web3Auth
const clientId = "BGwaIosaBxaybD5zWNjueOuCie6S-9px6zL8ePhC33JapspdIIRhGSV7XsyOHpz2FWPiIZWjZxH_4sda5v6bfIA"; // Replace with your client ID
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://ethereum-sepolia-rpc.publicnode.com",
  displayName: "Ethereum Sepolia",
  blockExplorerUrl: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};
const web3auth = new Web3AuthNoModal({
  clientId,
  chainConfig,
  web3AuthNetwork: "sapphire_devnet",
>>>>>>> Stashed changes
});
const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
const openloginAdapter = new OpenloginAdapter({
  privateKeyProvider: privateKeyProvider,
});
web3auth.configureAdapter(openloginAdapter);

// Create a new context
export const Web3AuthContext = createContext(web3auth);

const ScaffoldEthApp = ({ children }: ScaffoldEthAppProps) => {
  const [provider, setProvider] = useState<IProvider | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          console.log("login status:");
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <Web3AuthContext.Provider value={web3auth}>
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          </Web3AuthContext.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
