# Changelog

## 2.6.0 — 2026-11-19

Server `@browser-ai-agent/mcp` 2.6.0 · ekstensi 2.3.0 · protocol dan extension-core 2.1.0

### Diubah

- **UI popup baru**: selalu berlatar putih (tidak lagi mengikuti mode gelap sistem), dengan aksen biru logo. Status koneksi, permintaan **Allow**, dan kode pairing tampil sebagai kartu; tombol **Stop** berwarna merah lembut. Halaman Settings ikut diperbarui.
- **Folder `chrome-extension/` selalu sinkron**: `pnpm build` menyalin build terbaru ke folder ini, jadi folder yang dimuat di Chrome tidak bisa tertinggal versi.
- **Identitas ekstensi sendiri**: signing key dan ID baru (`nnefnmigpdhmjibkfiliklaiolihklai`). Daemon hanya menerima ID ini; ID Chrome Web Store milik Browser MCP dihapus.
- Identifier `browsermcp` yang tersisa diganti, termasuk elemen kursor yang disisipkan ke halaman.
- Link dokumentasi dan pesan pembaruan mengarah ke repo ini (paket npm belum diterbitkan).
- Logo popup diperkecil dari 562 KB menjadi 72 KB.

### Diperbaiki

- Ekstensi build lama (ID `imlplcjl…`) ditolak daemon berulang kali. Muat ulang ekstensi dari `chrome-extension/`.
- Fixture test yang masih memakai nama produk lama.

### Upgrade dari versi sebelumnya

1. `git pull && pnpm install && pnpm build`
2. Di `chrome://extensions`: hapus ekstensi lama, lalu **Load unpacked** folder `chrome-extension`.
3. Restart aplikasi AI, lalu cocokkan kode dan klik **Allow** (ID ekstensi berubah, jadi perlu pairing ulang).
