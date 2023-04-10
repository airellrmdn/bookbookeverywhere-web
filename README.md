
# Proyek Akhir Sistem Basis Data
## Book Book Everywhere- Kelompok 09

Proyek kali ini kami membuat sebuah website pembelian toko buku online bernama Book Book Everywhere.
Latar belakang dari proyek yang kami buat ini adalah kami ingin memudahkan pelanggan dalam memesan dan
membeli buku secara online dan akan mengambil buku yang telah dipesan melalui cabang terdekat dari toko kami.
Pada proyek kali ini kami menggunakan framework html, javascript, dan postgreSQL.
Terdapat beberapa fitur yang kami sediakan pada website ini, diantaranya adalah :





#### Administrator's Features 

- Add Product
- Add Update Product
- Manage Order
- Edit Store Information

#### User's Features
- Display Products
- Top Up E-Wallet
- Buy Product
- Payment

## Table Book Book Everywhere

#### 1. Table Buku

```http
 Table ini digunakan untuk menyimpan koleksi buku toko.
```

| Attribute | Data Type     | 
| :-------- | :------- | 
| `ISBN` | `BIG INT` | 
| `JUDUL` | `TEXT` | 
| `KATEGORI` | `TEXT` | 
| `PENULIS` | `TEXT` | 
| `PENERBIT` | `TEXT` | 
| `TANGGAL_TERBIT` | `DATE` | 
| `JUMLAH_HALAMAN` | `INT` | 
| `STOK` | `INT` | 
| `HARGA` | `INT` | 
| `AVAILABLE` | `BOOLEAN` | 
| `DESKRIPSI` | `TEXT` | 

#### 2. Table Pemesanan

```http
Table ini digunakan untuk menyimpan pemesanan buku.
```

| Attribute| Data Type     | 
| :-------- | :------- | 
| `ID_TRANSAKSI`      | `SERIAL` |
| `ID_USER`      | `SERIAL` |
| `TANGGAL_TRANSAKSI`      | `DATE` |
| `ISBN`      | `BIGINT` |
| `JUMLAH`      | `INT` |
| `HARGA_TOTAL`      | `INT` |
| `TANGGAL_PENGAMBILAN`      | `DATE` |

#### 3. Table Toko

```http
Table ini digunakan untuk menyimpan daftar toko yang ada.
```

| Attribute| Data Type     | 
| :-------- | :------- | 
| `ID_TOKO`      | `INT` |
| `NAMA_TOKO`      | `TEXT` |
| `ALAMAT`      | `TEXT` |
| `NOMOR_TELEPON`      | `TEXT` |
| `JAM_BUKA`      | `TIME` |
| `JAM_TUTUP`      | `TIME` |

#### 4. Table Pengguna

```http
Table ini digunakan untuk menyimpan daftar pengguna yang ada.
```

| Attribute| Data Type     | 
| :-------- | :------- | 
| `ID_USER`      | `SERIAL` |
| `USERNAME`      | `VARCHAR` |
| `PASSWORD`      | `TEXT` |
| `NAMA`      | `TEXT` |
| `NO_HP`      | `TEXT` |
| `ADMIN`      | `BOOLEAN` |
| `SALDO`      | `BIGINT` 




## 🚀 Group 9 Members:
- Airell Ramadhan Budiraharjo    ( 2006535230)
- Amanda Fairuz Syifa              ( 2006535653)
- Windiarta                     (2006535792)
- Fikri Afif Musyaffa           (2006536662)

