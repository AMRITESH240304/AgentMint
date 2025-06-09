import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { aeneid } from "@story-protocol/core-sdk"; // Using aeneid as per your example

const config = getDefaultConfig({
  appName: "Test Story App",
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string, // Vite environment variable
  chains: [aeneid],
  ssr: false, // Set to false for client-side rendering with Vite, or true if you have SSR configured
});

const queryClient = new QueryClient();

export default function Web3Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}