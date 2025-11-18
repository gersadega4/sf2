"use client";

import { useState } from "react";
import { useIrys } from "@/hooks/useIrys";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Wallet, Upload, ExternalLink } from "lucide-react";

export default function Web3Dashboard() {
  const { connectedAddress, connectWallet, uploadData, isLoading } = useIrys();
  const [tweetContent, setTweetContent] = useState("");
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveToIrys = async () => {
    if (!tweetContent) return;
    setIsUploading(true);
    try {
      const payload = {
        content: tweetContent,
        timestamp: new Date().toISOString(),
        author: connectedAddress,
        chain: "1270", // ID Chain Irys Testnet
        app: "x-pantau-sf"
      };

      const txId = await uploadData(payload);
      setLastTxId(txId);
    } catch (error) {
      console.error(error);
      alert("Gagal upload. Pastikan Anda memiliki token testnet IRYS (Chain 1270).");
    } finally {
      setIsUploading(false);
    }
  };

  if (!connectedAddress) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Card className="w-[400px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Login X-Pantau</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={connectWallet} 
              className="w-full gap-2 font-semibold cursor-pointer" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Wallet />}
              {isLoading ? "Menghubungkan..." : "Connect Wallet (Chain 1270)"}
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Otomatis berpindah ke Irys Testnet
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Pantau Dashboard</h1>
        <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-md font-mono border border-slate-300">
                {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
            </div>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Simpan Catatan Baru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Apa yang sedang Anda pantau di X?" 
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            className="h-12"
          />
          <Button 
            onClick={handleSaveToIrys} 
            disabled={isUploading || !tweetContent}
            className="w-full gap-2 cursor-pointer"
          >
             {isUploading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
             Upload ke Irys Testnet
          </Button>
        </CardContent>
      </Card>

      {lastTxId && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm space-y-2">
          <div className="flex items-center gap-2 text-blue-800 font-semibold">
            <span className="text-lg">🎉</span> Upload Berhasil!
          </div>
          <p className="text-slate-600">
            Data Anda telah tersimpan secara permanen di jaringan.
          </p>
          <div className="flex flex-col gap-2 mt-2">
             {/* Link ke Gateway */}
             <a 
                href={`https://gateway.irys.xyz/${lastTxId}`} 
                target="_blank" 
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
             >
                <ExternalLink size={14} /> Lihat Data JSON (Gateway)
             </a>
             
             {/* Link ke Irys Explorer Testnet */}
             <a 
                href={`https://testnet-explorer.irys.xyz/tx/${lastTxId}`} 
                target="_blank" 
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
             >
                <ExternalLink size={14} /> Cek di Explorer (Chain 1270)
             </a>
          </div>
        </div>
      )}
    </div>
  );
}