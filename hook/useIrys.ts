"use client";

import { useState } from "react";
import { WebIrys } from "@irys/sdk";
import { BrowserProvider } from "ethers";

// Konfigurasi Jaringan Irys Testnet (L1)
const IRYS_NETWORK_CONFIG = {
  chainId: "0x4F6", // 1270 dalam Hex
  chainName: "Irys Testnet",
  rpcUrls: ["https://testnet-rpc.irys.xyz/v1/execution-rpc"],
  nativeCurrency: {
    name: "Irys",
    symbol: "IRYS",
    decimals: 18,
  },
  blockExplorerUrls: ["https://testnet-explorer.irys.xyz/"],
};

// Node Irys Devnet (support EVM chains)
const IRYS_NODE_URL = "https://devnet.irys.xyz"; 

export const useIrys = () => {
  const [irys, setIrys] = useState<WebIrys | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi otomatis ganti/tambah network di MetaMask
  const switchNetwork = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: IRYS_NETWORK_CONFIG.chainId }],
      });
    } catch (error: any) {
      // Error 4902: Chain belum ada di wallet, tambahkan dulu
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [IRYS_NETWORK_CONFIG],
          });
        } catch (addError) {
          console.error("Gagal menambahkan network:", addError);
          throw addError;
        }
      } else {
        console.error("Gagal ganti network:", error);
        throw error;
      }
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      if (!window.ethereum) {
        alert("Harap install MetaMask!");
        return;
      }

      // 1. Switch ke Irys Testnet (Chain ID 1270)
      await switchNetwork();

      // 2. Init Ethers Provider
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setConnectedAddress(address);

      // 3. Init WebIrys
      // Token tetap diset 'ethereum' karena Irys devnet mendeteksi standar EVM
      const wallet = { 
        name: "ethersv6", 
        provider: provider, 
        options: { provider: provider, signer: signer } 
      };

      const webIrys = new WebIrys({
        url: IRYS_NODE_URL,
        token: "ethereum", 
        wallet: wallet,
      });

      await webIrys.ready();
      setIrys(webIrys);
      console.log("Terhubung ke Irys Testnet (Chain 1270)");

    } catch (error) {
      console.error("Error connection:", error);
      alert("Gagal koneksi. Pastikan MetaMask terinstall.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadData = async (data: unknown) => {
    if (!irys) throw new Error("Irys belum terkoneksi");
    try {
      const dataToUpload = JSON.stringify(data);
      // Upload ke Irys
      const receipt = await irys.upload(dataToUpload);
      return receipt.id;
    } catch (e) {
      console.error("Upload error:", e);
      throw e;
    }
  };

  return { irys, connectedAddress, connectWallet, uploadData, isLoading };
};