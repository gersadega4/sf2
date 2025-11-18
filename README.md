# X-Pantau SF (Web3 Edition)

**X-Pantau SF** adalah aplikasi pemantauan terdesentralisasi. Aplikasi ini memungkinkan pengguna untuk menyimpan catatan pantauan secara permanen di jaringan **Irys L1 Testnet** menggunakan dompet kripto (Wallet) sebagai autentikasi.

## 🚀 Fitur Utama

- **🔐 Decentralized Auth:** Login menggunakan Wallet (MetaMask/EVM), tanpa database tradisional.
- **💾 Permanent Storage:** Data disimpan secara permanen di **Irys L1 Testnet**.
- **⚡ Auto Network Switch:** Otomatis mendeteksi dan menambahkan jaringan Irys Testnet (Chain ID 1270).
- **🎨 Modern UI:** Next.js 15 + Tailwind v4 + shadcn/ui.

## 🌐 Konfigurasi Jaringan

| Parameter | Value |
| :--- | :--- |
| **Network** | Irys Testnet |
| **RPC URL** | `https://testnet-rpc.irys.xyz/v1/execution-rpc` |
| **Chain ID** | `1270` (Hex: `0x4F6`) |
| **Currency** | IRYS |
| **Explorer** | [testnet-explorer.irys.xyz](https://testnet-explorer.irys.xyz/) |

> **Penting:** Anda memerlukan token testnet IRYS di Chain 1270 untuk membayar biaya upload.

## 📦 Cara Menjalankan

1. **Install Dependensi**
   ```bash
   npm install