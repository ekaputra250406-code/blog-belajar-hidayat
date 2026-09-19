// ==========================================
/// ==========================================
// 1. FITUR DARK MODE (MODE GELAP / TERANG)
// ==========================================
const btnTheme = document.getElementById('btnTheme');

// Cek status tema yang tersimpan di LocalStorage saat pertama dimuat
const temaTersimpan = localStorage.getItem('tema');

if (temaTersimpan === 'dark') {
    document.body.classList.add('dark-mode');
    btnTheme.textContent = '☀️ Mode Terang';
}

btnTheme.addEventListener('click', function() {
    // Switch class dark-mode
    document.body.classList.toggle('dark-mode');

    // Simpan status ke LocalStorage & ubah teks tombol
    if (document.body.classList.contains('dark-mode')) {
        btnTheme.textContent = '☀️ Mode Terang';
        localStorage.setItem('tema', 'dark');
    } else {
        btnTheme.textContent = '🌙 Mode Gelap';
        localStorage.setItem('tema', 'light');
    }
});


// ==========================================
// 2. FITUR PENCARIAN ARTIKEL
// ==========================================
const inputCari = document.getElementById('inputCari');
const daftarArtikel = document.querySelectorAll('article'); // Mengambil semua elemen <article>

inputCari.addEventListener('keyup', function() {
    const kataKunci = inputCari.value.toLowerCase();

    daftarArtikel.forEach(function(artikel) {
        const judul = artikel.querySelector('h2').textContent.toLowerCase();
        const isi = artikel.querySelector('p').textContent.toLowerCase();

        // Jika judul atau isi cocok dengan kata kunci, tampilkan. Jika tidak, sembunyikan.
        if (judul.includes(kataKunci) || isi.includes(kataKunci)) {
            artikel.style.display = 'block';
        } else {
            artikel.style.display = 'none';
        }
    });
});


// ==========================================
// ==========================================
// 3. FITUR FORM KOMENTAR + LOCALSTORAGE (+ HAPUS)
// ==========================================
const form = document.getElementById('formKomentar');
const inputNama = document.getElementById('nama');
const inputPesan = document.getElementById('pesan');
const wadahKomentar = document.getElementById('daftarKomentar');

// Fungsi untuk menampilkan daftar komentar dari LocalStorage
function tampilkanKomentar() {
    const simpananKomentar = JSON.parse(localStorage.getItem('dataKomentar')) || [];

    if (simpananKomentar.length === 0) {
        wadahKomentar.innerHTML = '<p><em>Belum ada komentar. Jadilah yang pertama!</em></p>';
        return;
    }

    wadahKomentar.innerHTML = ''; 

    // Looping data komentar dan tambahkan tombol Hapus
    simpananKomentar.forEach(function(item, index) {
        const elemenKomentar = document.createElement('div');
        elemenKomentar.style.borderLeft = '4px solid #27ae60';
        elemenKomentar.style.backgroundColor = 'rgba(0,0,0,0.03)';
        elemenKomentar.style.padding = '10px';
        elemenKomentar.style.marginTop = '10px';
        elemenKomentar.style.borderRadius = '4px';
        elemenKomentar.style.display = 'flex';
        elemenKomentar.style.justifyContent = 'space-between';
        elemenKomentar.style.alignItems = 'center';

        elemenKomentar.innerHTML = `
            <div>
                <strong>${item.nama}</strong>
                <p style="margin: 5px 0 0 0;">${item.pesan}</p>
            </div>
            <button onclick="hapusKomentar(${index})" style="background-color: #e74c3c; padding: 5px 10px; font-size: 12px; margin-left: 10px;">Hapus</button>
        `;
        wadahKomentar.appendChild(elemenKomentar);
    });
}

// Fungsi untuk menghapus komentar berdasarkan index
function hapusKomentar(index) {
    let simpananKomentar = JSON.parse(localStorage.getItem('dataKomentar')) || [];
    
    // Hapus 1 data pada urutan/index yang dipilih
    simpananKomentar.splice(index, 1);
    
    // Simpan kembali data yang baru ke LocalStorage
    localStorage.setItem('dataKomentar', JSON.stringify(simpananKomentar));
    
    // Perbarui tampilan di halaman
    tampilkanKomentar();
}

// Jalankan fungsi tampilkanKomentar saat halaman dimuat
tampilkanKomentar();

// Event saat form di-submit
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nama = inputNama.value;
    const pesan = inputPesan.value;

    const simpananKomentar = JSON.parse(localStorage.getItem('dataKomentar')) || [];
    simpananKomentar.push({ nama: nama, pesan: pesan });

    localStorage.setItem('dataKomentar', JSON.stringify(simpananKomentar));

    tampilkanKomentar();

    inputNama.value = '';
    inputPesan.value = '';
});
// ==========================================
// 4. FITUR HITUNG WAKTU BACA (READING TIME)
// ==========================================
function hitungWaktuBaca() {
    // Rata-rata kecepatan membaca manusia (200 kata per menit)
    const kataPerMenit = 200; 

    // Ambil semua elemen artikel
    const daftarArtikel = document.querySelectorAll('article');

    daftarArtikel.forEach(function(artikel) {
        // Ambil seluruh teks di dalam artikel tersebut
        const teks = artikel.textContent || artikel.innerText;
        
        // Hitung jumlah kata (memisahkan teks berdasarkan spasi)
        const jumlahKata = teks.trim().split(/\s+/).length;
        
        // Hitung estimasi menit (pembulatan ke atas)
        const estimasiMenit = Math.ceil(jumlahKata / kataPerMenit);
        
        // Cari wadah span 'waktu-baca' di dalam artikel ini
        const elemenWaktu = artikel.querySelector('.waktu-baca');
        
        if (elemenWaktu) {
            elemenWaktu.textContent = `⏱️ ${estimasiMenit} menit baca`;
        }
    });
}

// Jalankan fungsi saat halaman selesai dimuat
hitungWaktuBaca();
// ==========================================
// ==========================================
// ==========================================
// ==========================================
// ==========================================
// 6. FITUR LIKE ARTIKEL (LOCALSTORAGE)
// ==========================================
function muatDataLike() {
    const tombolLike = document.querySelectorAll('.btn-like');
    
    tombolLike.forEach(btn => {
        // Ambil kunci unik artikel dari atribut onclick
        const kunci = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        const jumlah = localStorage.getItem(kunci) || 0;
        const isLiked = localStorage.getItem(kunci + '_status') === 'true';

        // Tampilkan angka jumlah like
        btn.querySelector('.jumlah-like').textContent = jumlah;

        // Beri warna merah jika user pernah menyukai artikel ini
        if (isLiked) {
            btn.classList.add('liked');
        }
    });
}

function tambahLike(btn, kunci) {
    let jumlah = parseInt(localStorage.getItem(kunci)) || 0;
    let isLiked = localStorage.getItem(kunci + '_status') === 'true';

    if (!isLiked) {
        // Jika belum disukai, tambahkan 1
        jumlah += 1;
        localStorage.setItem(kunci, jumlah);
        localStorage.setItem(kunci + '_status', 'true');
        btn.classList.add('liked');
    } else {
        // Jika diklik lagi, kurangi 1 (Unlike)
        jumlah = Math.max(0, jumlah - 1);
        localStorage.setItem(kunci, jumlah);
        localStorage.setItem(kunci + '_status', 'false');
        btn.classList.remove('liked');
    }

    // Update angka di layar
    btn.querySelector('.jumlah-like').textContent = jumlah;
}

// Jalankan saat halaman dibuka
muatDataLike();
// ==========================================
// 7. FITUR BAGIKAN ARTIKEL (MODAL POPUP)
// ==========================================
let urlShareAktif = '';

function bagikanArtikel(idArtikel) {
    const artikel = event.target.closest('article');
    const judul = artikel ? artikel.querySelector('h2').textContent : 'Catatan Belajar IT';
    
    urlShareAktif = window.location.href.split('#')[0] + '#' + idArtikel;

    // Tampilkan judul di modal
    document.getElementById('judulArtikelShare').textContent = judul;

    // Set tautan WhatsApp & Email
    const teksWA = encodeURIComponent(`Yuk baca artikel "${judul}" di Catatan Belajar Hidayat Eka Saputra: ${urlShareAktif}`);
    document.getElementById('shareWA').href = `https://wa.me/?text=${teksWA}`;

    const teksMail = encodeURIComponent(`Halo, saya ingin membagikan artikel menarik berjudul "${judul}". Cek di sini: ${urlShareAktif}`);
    document.getElementById('shareMail').href = `mailto:?subject=${encodeURIComponent(judul)}&body=${teksMail}`;

    // Tampilkan modal popup
    document.getElementById('modalShare').style.display = 'flex';
}

function tutupModalShare() {
    document.getElementById('modalShare').style.display = 'none';
}

function salinLinkModals() {
    navigator.clipboard.writeText(urlShareAktif).then(() => {
        alert('📋 Tautan artikel berhasil disalin!');
        tutupModalShare();
    });
}

// Tutup modal jika klik di luar area konten
window.onclick = function(event) {
    const modal = document.getElementById('modalShare');
    if (event.target === modal) {
        tutupModalShare();
    }
};
// ==========================================
// 8. FITUR READING PROGRESS BAR
// ==========================================
window.addEventListener('scroll', function() {
    const totalTinggiHalaman = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const posisiScroll = document.documentElement.scrollTop || document.body.scrollTop;
    
    // Hitung persentase scroll (0 - 100%)
    const persentase = (posisiScroll / totalTinggiHalaman) * 100;
    
    // Ubah lebar elemen progressBar
    document.getElementById('progressBar').style.width = persentase + '%';
});
// ==========================================
// 9. FITUR WIDGET QUOTE MOTIVASI IT
// ==========================================
const daftarQuote = [
    {
        teks: "First, solve the problem. Then, write the code.",
        penulis: "— John Johnson"
    },
    {
        teks: "Kunci keberhasilan belajar koding adalah konsistensi, bukan seberapa cepat kamu paham dalam sehari.",
        penulis: "— Hidayat Eka Saputra"
    },
    {
        teks: "Experience is the name everyone gives to their mistakes.",
        penulis: "— Oscar Wilde"
    },
    {
        teks: "Jangan takut ketemu error, karena dari error-lah seorang programmer belajar memecahkan masalah.",
        penulis: "— Hidayat Eka Saputra"
    },
    {
        teks: "Code is like humor. When you have to explain it, it’s bad.",
        penulis: "— Cory House"
    }
];

function tampilQuoteAcak() {
    const indeksAcak = Math.floor(Math.random() * daftarQuote.length);
    const quotePilihan = daftarQuote[indeksAcak];

    document.getElementById('teksQuote').textContent = quotePilihan.teks;
    document.getElementById('penulisQuote').textContent = quotePilihan.penulis;
}

// Jalankan otomatis saat halaman dimuat
tampilQuoteAcak();