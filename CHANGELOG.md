# Changelog

### 4.15 (22 Januari 2026)
- Teacher can write comment to student's Journal
- Showing indicator notification on bottom nav: new journal (not yet validated)

### 4.14 (8 Januari 2026)
- Filter Journal by draft and show `public only`
- Create printable page for `Berita Acara`
- Jurusan can filter Pemetaan by `Pembimbing`

### 4.13.10 (1 Januari 2026)
- Patch: showing Mood emoji correctly after modified BE structure
- Fix issue userAgent in mobile device

### 4.13.9 (31 Desember 2025)
- Improvement: show current mood peserta

### 4.13.8 (20 Desember 2025)
- Improvement: show temporary item peserta ketika dipetekan ke pembimbing
- Bug fix null value when remove item from select input

### 4.13.7 (15 Desember 2025)
- Patch & Improvement:
  - Show stats Pembimbing and IDUKA for some role
  - Allowed some role to access Pembimbing and IDUKA

### 4.13.5 (8 Desember 2025)
- Improvement: filter info relasi IDUKA

### 4.0 (15 Agustus 2025)
- Rewrite from Python (Django) to Javascript (Vue)
- Migrating to BaaS: [Pocketbase](https://pocketbase.io) ([Golang](https://go.dev) based)
- Remove portfolio and karya ilmiah ft.
- Management Elemen Mapel PKL, related to Rapor
- Import Peserta & IDUKA
- `New` Multiple role: TU, Teacher, Management, VP and Headmaster
- `New` Surat TTE & TTB
- `New` Journal
- `New` Leger Nilai
- `New` Rapor
- `New` Certificate *(opsional)*
- `New` Mapping Guru Pembimbing ke Peserta sesuai JP *(under development)*
