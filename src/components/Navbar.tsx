import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WalletIcon, MessageCircleIcon, MenuIcon, XIcon } from "lucide-react";
import ChatBox from "./ChatBox";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Badge,
  EthBalance,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';
import { color } from "@coinbase/onchainkit/theme";

declare global {
  interface Window {
    ethereum: any;
  }
}

export interface AccountType {
  address: string;
  chainId: string;
  balance: string;
}

const OnchainKitWallet = () => {
  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity
            className="px-4 pt-3 pb-2"
            hasCopyAddressOnClick
          >
            <Avatar />
            <Name>
              <Badge />
            </Name>
            <Address className={color.foregroundMuted} />
            <EthBalance />
          </Identity>
          <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
            Go to Wallet Dashboard
          </WalletDropdownLink>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountData, setAccountData] = useState<AccountType | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const chainId = await window.ethereum.request({ 
          method: "eth_chainId" 
        });

        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"]
        });

        const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

        setAccountData({
          address: accounts[0],
          chainId: chainId,
          balance: balanceInEth.toFixed(4) + " ETH"
        });
        setIsConnected(true);

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
      } catch (error) {
        console.error("Failed to connect MetaMask", error);
        alert(`Error connecting to MetaMask: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      alert("MetaMask not installed. Please install MetaMask!");
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAccountData(null);
    } else {
      connectMetaMask();
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          await connectMetaMask();
        }
      }
    };

    checkConnection();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 text-white shadow-2xl rounded-b-lg">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-wide transform transition-all hover:scale-105 hover:text-blue-200"
        >
          Insurance
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/health"
            className="text-xl font-extrabold tracking-wide transform transition-all hover:scale-105 hover:text-blue-200"
          >
            Health Insurance
          </Link>
          <div className="flex items-center space-x-4">
            <OnchainKitWallet />
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-yellow-500 px-5 py-2 rounded-full hover:bg-yellow-600 transition-all shadow-md">
                  <MessageCircleIcon className="w-5 h-5" />
                  Chatbot
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white p-6 rounded-2xl shadow-2xl w-[500px] border-none">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-blue-800">
                    Chat with Us
                  </DialogTitle>
                </DialogHeader>
                <ChatBox />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute left-0 right-0 bg-gradient-to-r from-blue-700 to-blue-900 p-4 space-y-4 rounded-b-lg 
          transform transition-all duration-300 ease-in-out 
          ${isMobileMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
      >
        <Link
          to="/health"
          className="block text-xl font-extrabold tracking-wide hover:text-blue-200"
          onClick={toggleMobileMenu}
        >
          Health Insurance
        </Link>
        <div className="space-y-4">
          {isConnected && accountData ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm">
                {`${accountData.address.slice(0, 6)}...${accountData.address.slice(-4)}`}
              </span>
            </div>
          ) : (
            <button
              onClick={connectMetaMask}
              className="w-full flex items-center gap-2 bg-green-500 px-5 py-2 rounded-full hover:bg-green-600 transition-all shadow-md"
            >
              <WalletIcon className="w-5 h-5" />
              Connect MetaMask
            </button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full flex items-center gap-2 bg-yellow-500 px-5 py-2 rounded-full hover:bg-yellow-600 transition-all shadow-md">
                <MessageCircleIcon className="w-5 h-5" />
                Chatbot
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white p-6 rounded-2xl shadow-2xl w-[500px] border-none">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-800">
                  Chat with Us
                </DialogTitle>
              </DialogHeader>
              <ChatBox />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;