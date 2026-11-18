# Changelog

## 2.8.0 — 2026-11-19

Server 2.6.2 · ekstensi 2.5.0 · extension-core 2.3.0 · protocol 2.2.0

### Diubah

- **Langkah Connect sebelum kode pairing**: saat ekstensi pertama kali menemukan server yang belum pernah di-**Allow**, popup kini bertanya dulu _"Connect to the Browser AI Agent Control server?"_ (beserta port dan versinya). Kode pairing belum dibuat sebelum Anda menekan **Connect**, karena nonce ekstensi baru dikirim saat itu. Setelahnya, alur berlanjut seperti biasa: cocokkan kode dengan aplikasi AI, lalu **Allow**. Server yang sudah pernah di-Allow tetap tersambung otomatis.
- Pesan untuk aplikasi AI sebelum Connect: _"Open the Browser AI Agent Control extension's popup and click Connect, then click Allow if the six digits match the ones shown here"_.

## 2.7.0 — 2026-11-19

Server 2.6.1 · ekstensi 2.4.0 · extension-core 2.2.0

### Ditambahkan

- **Tombol Disconnect** di popup (saat terhubung dan saat menunggu **Allow**): memutus koneksi ke server dan kembali ke tampilan awal untuk connect. Ekstensi tidak tersambung otomatis lagi, termasuk setelah Chrome di-restart, sampai Anda menekan **Connect now**. Pairing tetap tersimpan, jadi connect ulang tidak perlu Allow lagi.
- **Tombol Connect now** di popup saat menunggu server: ekstensi langsung mencari server tanpa menunggu jeda percobaan berikutnya.
- **Langkah koneksi di popup**: pesan "Waiting for the server" kini menjelaskan cara menyalakan server (lewat aplikasi AI, atau `pnpm daemon`).
- **`pnpm daemon`**: menyalakan server secara manual tanpa aplikasi AI, dengan opsi baru `--keep-alive` agar server tidak berhenti setelah 10 menit menganggur. Berguna untuk pairing (**Allow**) sebelum membuka aplikasi AI.

## 2.6.1 — 2026-11-19

Ekstensi 2.3.1 (server tetap 2.6.0)

### Diubah

- Tombol **Stop**/**Resume** di popup hanya muncul setelah ekstensi terhubung dan server sudah di-**Allow**. Sebelumnya tombol ini tampil saat masih menunggu server, sehingga **Resume** dari sesi sebelumnya terlihat seolah-olah ekstensi sudah terhubung. Status pause yang tersimpan tetap berlaku dan **Resume** muncul begitu server di-Allow.

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
