import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export function useRainbowKit() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return {
    address,
    isConnected,
    openConnectModal
  };
}
