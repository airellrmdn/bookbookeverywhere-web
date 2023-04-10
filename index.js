//Import packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
 
//Initialize the app as an express app
const app = express();
const router = express.Router();
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const { route } = require('express/lib/application');

//Insiasi koneksi ke database
const db = new Client({
    user: 'airell_sbd',
    host: 'airell-sbd.postgres.database.azure.com',
    database: 'bookbookeverywhere',
    password: 'Admin1811',
    port: 5432,
    sslmode: 'require',
    ssl: true,
});

//Melakukan koneksi dan menunjukkan indikasi database terhubung
db.connect((err) => {
    if(err){
        console.log(err)
        return
    }
    console.log('Database berhasil terkoneksi')
});
 
//Middleware (session)
app.use(
    session({
        secret: 'ini contoh secret',
        saveUninitialized: false,
        resave: false
    })
);
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// SETTING STATIC VARIABLE
app.use(express.static(__dirname+'/public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/images'))

app.set('views', './views');
app.set('view engine', 'ejs');

var temp;
 
//ROUTERS GET
 
//Router 1: Menampilkan landing page (login/register)
router.get('/', (req, res) => {
    temp = req.session;
    if (temp.username) { //jika user terdaftar maka akan masuk ke halaman utama
        return res.render('Bookpage');
    } else { //login / register page
        res.render('Homepage');
    }
});

//Router 2: Menampilkan register akun
router.get('/registration', (req, res)=>{
    res.render('Register');
});

//Router 3: Menampilkan buku beserta informasinya
router.get('/main', (req, res)=>{
    temp = req.session;
    if(temp.username){ 
        res.render('Bookpage');
    } else res.redirect('/')
});

//Router 4: Menampilkan toko buku beserta informasinya
router.get('/store', (req, res)=>{
    if(temp.username){ 
        res.render('Store');
    } else res.redirect('/')
});

//Router 5: Menampilkan 'tentang kami'
router.get('/aboutus', (req, res)=>{
    if(temp.username){ 
        res.render('Aboutus');
    } else res.redirect('/')
});

//Router 6: Menampilkan identitas pemilik akun
router.get('/profile', (req, res)=>{
    temp = req.session;
    if (temp.username) { 
        return res.render('Profile');
    } else {
        return res.redirect('/');
    }
});

//Router 7: Mengakses detil buku
router.get('/bookdetail', (req, res)=>{
    if(temp.username){ 
        res.render('Bookdetail');
    } else res.redirect('/')
});

//Router 8: Mengakses Keranjang Belanja
router.get('/cart', (req, res)=>{
    if(temp.username){ 
        res.render('Cart');
    } else res.redirect('/')
});

//Router 9: Mengakses Page Admin Control
router.get('/admin', (req, res)=>{
    if(temp.admin){ 
        res.render('Admin');
    } else if (temp.username){
        res.redirect('/main');
    } else res.redirect('/')
});

//Router 10: Mengakses Page Untuk Mengupdate Buku Yang Sudah Ada
router.get('/updatebook', (req, res)=>{
    if(temp.admin){ 
        res.render('Updatebook');
    } else if (temp.username){
        res.redirect('/main');
    } else res.redirect('/')
});

//Router 11: Mengakses Page Untuk Mengubah Data Store
router.get('/editstore', (req, res)=>{
    if(temp.admin){ 
        res.render('Editstore');
    } else if (temp.username){
        res.redirect('/main');
    } else res.redirect('/')
})

//Router 12: Mengakses Page Untuk Mengatur Daftar Pesanan
router.get('/manageorder', (req, res)=>{
    if(temp.admin){ 
        res.render('Manageorder');
    } else if (temp.username){
        res.redirect('/main');
    } else res.redirect('/')
})

//ROUTERS POST

//Router 13: Menambahkan Toko Baru yang Belum Terdapat Pada Daftar Toko
router.post('/newstore', (req, res) => {
    id = req.body.id;
    nama = req.body.name;
    address = req.body.address;
    phone = req.body.phone;
    opens = req.body.open;
    closes = req.body.close;

    const query = `INSERT INTO toko VALUES (${id}, '${nama}', '${address}', '${phone}', '${opens}', '${closes}')`;
    db.query(query, (err, results) => {
        if(err) {
            console.error(err);
            res.end('fail');
        } else {
            res.end('done');
        }
    });
});

//Router 14: Mengedit Toko yang Sudah Terdapat Dalam Daftar Toko
router.post('/updatestore', (req, res) => {
    id = req.body.id;
    nama = req.body.name;
    address = req.body.address;
    phone = req.body.phone;
    opens = req.body.open;
    closes = req.body.close;

    const query = `UPDATE toko SET nama_toko = '${nama}', alamat = '${address}', nomor_telepon = '${phone}',
                  jam_buka = '${opens}', jam_tutup = '${closes}' WHERE id_toko = ${id}`;
    db.query(query, (err, results) => {
        if(err) {
            console.error(err);
            res.end('fail');
        } else {
            res.end('done');
        }
    });
});

// Router 15: Menampilkan Data Lengkap Toko Berdasarkan id_toko
router.post('/getspstore', (req, res) => {
    id = req.body.id;
    const query = `SELECT * FROM toko WHERE id_toko = ${id}`;
    db.query(query, (err, results)=>{
        if(err) {
            console.error(err);
            res.end('fail');
        } else {
            res.send(results.rows);
            data = results.rows;
        }
    })
})

//Router 16: Menghapus Toko yang Sudah Ada Pada Daftar Toko Berdasarkan id_toko
router.post('/deletestore', (req, res) => {
    id = req.body.id;
    const query = `DELETE FROM toko WHERE id_toko = ${id}`;
    db.query(query, (err, results) => {
        if(err) {
            console.error(err);
            res.end('fail');
        } else {
            res.end('done');
        }
    });
})

//Router 17: Menampilkan Daftar Pemesanan Buku Oleh Pengguna Berdasarkan username Pengguna
router.post('/getcart', (req, res) => {
    temp = req.session;
    username = temp.username;
    db.query(`SELECT id_user FROM pengguna WHERE username = '${username}'`, (err, result) => {
        if(err){
            console.log(err);
        } else {
            user_id = result.rows[0].id_user;
            const query = `SELECT buku.judul AS judul, pemesanan.jumlah AS jumlah, pemesanan.id_transaksi AS id_transaksi, pemesanan.tanggal_transaksi AS tanggal_transaksi, 
                    pemesanan.tanggal_pengambilan AS tanggal_pengambilan FROM buku INNER JOIN pemesanan ON buku.isbn = pemesanan.isbn WHERE pemesanan.id_user = '${user_id}'`;
            db.query(query, (err, result)=>{
                if(err){
                    console.error(err);
                    res.end('fail');
                } else {
                    res.send(result.rows);
                }
            })
        }
    })
});
 
//Router 18: Melakukan Update Buku yang Hanya Dapat Dilakukan Oleh Admin
router.post('/updatebook', (req, res) => {
    isbn = req.body.isbn;
    title = req.body.title;
    category = req.body.cat;
    author = req.body.author;
    publisher = req.body.publisher;
    pdate = req.body.pdate;
    page = req.body.page;
    stock = req.body.stock;
    price = req.body.price;
    availability = req.body.availability;
    desc = req.body.desc;
    
    console.log(category);
    const query = `UPDATE buku SET isbn = ${isbn}, judul = '${title}', kategori = '${category}', penulis = '${author}', penerbit = '${publisher}', 
                    tanggal_terbit = '${pdate}', jumlah_halaman = ${page}, stok = ${stock}, harga = ${price}, available = ${availability}, deskripsi = '${desc}' WHERE isbn=${isbn}`;
    
    db.query(query, (err, results) => {
        if(err) {
            console.error(err);
            res.end('fail');
        } else {
            res.end('done');
        }
    });
});

//Router 19: Menghapus Buku yang Sudah Ada Pada Daftar Buku Berdasarkan isbn
router.post('/deletebook', (req, res) => {
    isbn = req.body.isbn;
    const query = `DELETE FROM buku WHERE isbn = ${isbn}`;
    db.query(query, (err, result) => {
        if(err) {
            console.error(err);
            res.end('fail');
        } else {
            res.end('done');
        }
    })
})

//Router 20: Menambahkan Buku Baru dengan Memasukkan Seluruh Informasi yang Dibutuhkan
router.post('/newbook', (req, res) => {
    isbn = req.body.isbn;
    title = req.body.title;
    category = req.body.cat;
    author = req.body.author;
    publisher = req.body.publisher;
    pdate = req.body.pdate;
    page = req.body.page;
    stock = req.body.stock;
    price = req.body.price;
    availability = req.body.availability;
    desc = req.body.desc;

    const query = `INSERT INTO buku VALUES (${isbn}, '${title}', '${category}', '${author}', '${publisher}', 
                    '${pdate}', ${page}, ${stock}, ${price}, ${availability}, '${desc}')`;

    db.query(query, (err, results) => {
        if(err) {
            console.error(err);
            res.end('fail');
        } else {
            res.end('done');
        }
    });
});

//Router 21: Menghapus Transaksi Pemesanan Berdasarkan id_transaksi 
router.post('/deletetrans', (req, res) => {
    id = req.body.id;
    const query = `DELETE FROM pemesanan WHERE id_transaksi = ${id}`;
    db.query(query, (err, results)=>{
        if(err) {
            console.error(err);
            res.end('fail');
        } else {
            res.end('done');
        }
    })
})

//Router 22: Melakukan Transaksi Pemesanan Buku
router.post('/transaction', (req, res) => {
    temp = req.session;
    username = temp.username;
    amount = req.body.amount;
    isbn = req.body.isbn;
    let price = 0;

    //Harus Login Terlebih Dahulu Karena Dibutuhkan Username Sebagai Pemilik Akun
    query = `SELECT id_user FROM pengguna WHERE username = '${username}'`;
    db.query(query, (err, results) => {
        if(err) {
           console.error(err);
           res.end('fail');
        } else {
            user_id = results.rows[0].id_user;
            query = `SELECT harga, available, stok FROM buku WHERE isbn = ${isbn}`;
            db.query(query, (err, results) => {
                if(err) {
                    console.error(err);
                } else {
                    price = results.rows[0].harga;
                    ready = results.rows[0].available;
                    stok = results.rows[0].stok;
                    if (stok == 0) {
                        res.end('fail');
                        return;
                    }
                    query = `UPDATE buku SET stok = stok - ${amount} WHERE isbn = ${isbn}`;
                    db.query(query, (err, results) => {
                        if(err) {
                            console.error(err);
                        } else {
                            console.log("Stok berhasil diperbaharui");
                            if (price != 0){
                                let total = amount * price;
                                console.log(total);
                                query = `UPDATE pengguna SET saldo = saldo - ${total} WHERE username = '${username}'`;
                                db.query(query, (err, results) => {
                                    if(err) {
                                        console.error(err);
                                        res.end('fail');
                                    } else {
                                        /* NOTES
                                            tanggal pengambilan : 
                                            Available : H+1 tanggal transaksi
                                            Pre Order : H+7 tanggal transaksi
                                        */
                                        // Available
                                        if(ready) {
                                            query = `INSERT INTO pemesanan VALUES (DEFAULT, ${user_id}, current_date, ${isbn}, ${amount}, ${total}, current_date + 1)`;
                                            db.query(query, (err, results) => {
                                                if(err){
                                                    console.error(err);
                                                    res.end('fail');
                                                } else {
                                                    res.end('done');
                                                }
                                            });
                                        //Pre Order
                                        } else {
                                            query = `INSERT INTO pemesanan VALUES (DEFAULT, ${user_id}, current_date, ${isbn}, ${amount}, ${total}, current_date + 7)`;
                                            db.query(query, (err, results) => {
                                                if(err){
                                                    console.error(err);
                                                    res.end('fail');
                                                } else {
                                                    res.end('done');
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }    
    });
});

//Router 23: Melakukan Login Berdasarkan Username dan Password Jika Sudah Pernah Membuat Akun
router.post('/login', (req, res) => {
    temp = req.session;
    temp.username = req.body.username;
    temp.password = req.body.pass;
    // query ambil data user untuk login
    const query = `SELECT password,admin FROM pengguna WHERE username = '${temp.username}'`; //query ambil data user untuk login

    //mengecek informasi yang dimasukkan user apakah terdaftar pada database
    db.query(query, (err, results) => {
       if (err){
           console.log('Username atau Password tidak ditemukan!');
           res.end('fail');
       }
       if (!results.rows[0]){
           console.log('Username atau Password tidak ditemukan!');
           res.end('fail');
       } else {       
            bcrypt.compare(temp.password, results.rows[0].password, (err, result) => {
                if(err){
                    console.log('Username atau Password tidak ditemukan!');
                    res.end('fail2');
                }
                if(!result){
                    console.log('Username atau Password tidak ditemukan!');
                    res.end('fail2');
                }
                temp.admin = results.rows[0].admin;
                console.log(temp.admin);
                res.end('done');
            });
        } 
    });
});

//Router 24: Mendaftar Akun Baru
router.post('/register', (req, res) => {
    temp = req.session;
    temp.username = req.body.username;
    temp.password = req.body.pass;
    temp.name = req.body.name;
    temp.phone = req.body.phone;
    temp.admin = false;
    //melakukan registrasi user baru ke dalam database
    //melakukan konfigurasi bcrypt disini
    bcrypt.hash(temp.password, 10, (err, hash) => {
        const query = `INSERT INTO pengguna (username, password, nama, no_hp, admin, saldo) VALUES ('${temp.username}', '${hash}', '${temp.name}', 
                       '${temp.phone}', 'false', 0);`;
        if (err) {
            return res.status(500).json({
                error: err
            });
        }
        db.query(query, (err, results) => {
            if(err){
                console.error(err);
                res.end('fail');
            } else {
                console.log(results);
                res.end('done');
            }
        });
    });
});

//Router 25: Melakukan Verifikasi untuk Menjadi Admin
router.post('/verify', (req, res)=>{
    pass = req.body.pass;
    if(pass === "HelloWorld!"){ //kode verifikasi admin
        res.end('done');
    } else {
        res.end('fail');
    }
})

//Router 26: Menampilkan Seluruh Informasi Data Pengguna Berdasarkan Username 
 router.post('/getprofile', (req, res) => {
    temp = req.session;
    username = temp.username;
    const query = `SELECT * FROM pengguna WHERE username = '${username}'`;
    db.query(query, (err, results) => {
        if(err) {
            console.error(err);
        } else {
            res.send(results.rows);
            data = results.rows;
        }
    });
});

//Router 27: Mengubah Status Admin Pada Akun Pengguna Berdasarkan Username
router.post('/addadmin', (req, res) => {
    temp = req.session;
    username = temp.username;
    const query = `UPDATE pengguna SET admin = 'TRUE' WHERE username = '${username}'`;
    db.query(query, (err, results) => {
       if(err) {
           console.error(err);
           res.end('fail');
       } else {
           temp.admin = true;
           res.end('done');
       }
    });
});

//Router 28: Melakukan Topup Saldo Berdasarkan Username
router.post('/topup', (req, res) => {
    temp = req.session;
    username = temp.username;
    amount = req.body.amount;
    const query = `UPDATE pengguna SET saldo = saldo + ${amount} WHERE username = '${username}'`;
    db.query(query, (err, results) => {
       if(err) {
           console.error(err);
           res.end('fail');
       } else {
           res.end('done');
       }
    });
});

//Router 29: Menampilkan Data Kategori Buku
router.post('/getdata', (req, res) => {
    const cat = req.body.category;
    var query;
    if(cat == "All"){   //ini all category
        query = "SELECT * FROM buku"; // query ambil data
    } else {            //ini special category
        query = `SELECT * FROM buku WHERE kategori = '${cat}';`; // query ambil data
    }
    db.query(query, (err, results) => {
       if(err){
           console.error(err);
       } else {
           res.send(results.rows);
           data = results.rows;
       }
    });
});

//Router 30: Menampilkan Buku Berdasarkan isbn
router.post('/getbook', (req, res) => {
    const query = `SELECT * FROM buku WHERE isbn = '${req.body.isbn}'`; // query ambil data
    db.query(query, (err, results) => {
       if(err){
           console.error(err);
       } else {
           res.send(results.rows);
           data = results.rows;
       }
    });
});

//Router 31: Menampilkan Seluruh Informasi yang Dimiliki Oleh Toko
router.post('/getstore', (req, res) =>{
    const query = `SELECT * FROM toko`; //query ambil data
    db.query(query, (err, results) => {
        if(err){
            console.error(err);
        } else {
            res.send(results.rows);
            data = results.rows;
        }
     });
});

//Router 32: Menghapus Session (logout)
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

app.use('/', router);
app.listen(process.env.PORT || 5230, () => {
    console.log(`App Started on PORT ${process.env.PORT || 5230}`);
});