// ==========================================
// KONFIGURASI JSONBIN
// ==========================================
const BIN_ID = '6aaeed3affd5d160531a54a3';
const MASTER_KEY = '$2a$10$y7nGfpfVNY9Jo6sy/KR4Kuy4/GqZks1O9aFK1vd4ASo8oOywRnEhu';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// DOM Elements
const formKomentar = document.getElementById('formKomentar');
const inputNama = document.getElementById('nama');
const inputPesan = document.getElementById('pesan');
const wadahKomentar = document.getElementById('daftarKomentar');

// ==========================================
// 1. FITUR TEMA (MODE GELAP / TERANG)
// ==========================================
const btnTheme = document.getElementById('btnTheme');
if (btnTheme) {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        btnTheme.textContent = '☀️ Mode Terang';
    }

    btnTheme.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            btnTheme.textContent = '☀️ Mode Terang';
            localStorage.setItem('theme', 'dark');
        } else {
            btnTheme.textContent = '🌙 Mode Gelap';
            localStorage.setItem('theme', 'light');
        }
    });
}

// ==========================================
// 2. FITUR READING PROGRESS BAR
// ==========================================
window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
});

// ==========================================
// 3. FITUR WIDGET QUOTE MOTIVASI IT
// ==========================================
const daftarQuote = [
    { teks: "First, solve the problem. Then, write the code.", penulis: "— John Johnson" },
    { teks: "Kunci keberhasilan belajar koding adalah konsistensi, bukan seberapa cepat kamu paham dalam sehari.", penulis: "— Hidayat Eka Saputra" },
    { teks: "Experience is the name everyone gives to their mistakes.", penulis: "— Oscar Wilde" },
    { teks: "Jangan takut ketemu error, karena dari error-lah seorang programmer belajar memecahkan masalah.", penulis: "— Catatan Belajar IT" },
    { teks: "Code is like humor. When you have to explain it, it’s bad.", penulis: "— Cory House" }
];

function tampilQuoteAcak() {
    const teksQuote = document.getElementById('teksQuote');
    const penulisQuote = document.getElementById('penulisQuote');
    if (teksQuote && penulisQuote) {
        const indeksAcak = Math.floor(Math.random() * daftarQuote.length);
        const quotePilihan = daftarQuote[indeksAcak];
        teksQuote.textContent = quotePilihan.teks;
        penulisQuote.textContent = quotePilihan.penulis;
    }
}
tampilQuoteAcak();

// ==========================================
// 4. FITUR SUKA (LIKE GLOBAL) & BAGIKAN
// ==========================================
async function muatLikeGlobal() {
    try {
        const response = await fetch(`${API_URL}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        if (!response.ok) return;

        const result = await response.json();
        const likesData = result.record.likes || {};

        document.querySelectorAll('.btn-like').forEach((btn, index) => {
            const key = `art${index + 1}`;
            const jumlah = likesData[key] || 0;
            const spanJumlah = btn.querySelector('.jumlah-like');
            if (spanJumlah) spanJumlah.textContent = jumlah;
        });
    } catch (error) {
        console.error('Gagal memuat data like:', error);
    }
}

async function tambahLike(btn, key) {
    try {
        const resGet = await fetch(`${API_URL}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        const dataGet = await resGet.json();
        const record = dataGet.record || {};
        const likesData = record.likes || {};

        // Tambah 1 jumlah like untuk artikel ini
        likesData[key] = (likesData[key] || 0) + 1;

        // Update ke server
        const resPut = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': MASTER_KEY
            },
            body: JSON.stringify({
                ...record,
                likes: likesData
            })
        });

        if (resPut.ok) {
            const spanJumlah = btn.querySelector('.jumlah-like');
            if (spanJumlah) spanJumlah.textContent = likesData[key];
        }
    } catch (error) {
        alert('Gagal menyukai artikel!');
        console.error('Error:', error);
    }
}

function bagikanArtikel(idArtikel) {
    const urlLengkap = window.location.href.split('#')[0] + '#' + idArtikel;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(urlLengkap).then(() => {
            alert('Link artikel berhasil disalin ke clipboard!');
        });
    } else {
        alert('Link artikel: ' + urlLengkap);
    }
}

// ==========================================
// 5. FITUR KOMENTAR ONLINE (JSONBin.io)
// ==========================================
async function muatKomentarOnline() {
    if (!wadahKomentar) return;
    wadahKomentar.innerHTML = '<p><em>Sedang memuat komentar...</em></p>';
    
    try {
        const response = await fetch(`${API_URL}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        
        if (!response.ok) throw new Error('Gagal mengambil data');

        const result = await response.json();
        const daftarKomentar = result.record.komentar || [];

        wadahKomentar.innerHTML = '';

        if (daftarKomentar.length === 0) {
            wadahKomentar.innerHTML = '<p><em>Belum ada komentar. Jadilah yang pertama!</em></p>';
            return;
        }

        daftarKomentar.slice().reverse().forEach((item, index) => {
            const originalIndex = daftarKomentar.length - 1 - index;

            const elemen = document.createElement('div');
            elemen.style.borderLeft = '4px solid #27ae60';
            elemen.style.backgroundColor = 'rgba(0,0,0,0.03)';
            elemen.style.padding = '10px';
            elemen.style.marginTop = '10px';
            elemen.style.borderRadius = '4px';
            elemen.style.display = 'flex';
            elemen.style.justifyContent = 'space-between';
            elemen.style.alignItems = 'center';

            elemen.innerHTML = `
                <div>
                    <strong>${item.nama}</strong>
                    <p style="margin: 5px 0 0 0;">${item.pesan}</p>
                </div>
                <button onclick="hapusKomentarOnline(${originalIndex})" style="background-color: #e74c3c; padding: 5px 10px; font-size: 12px; border:none; color:white; border-radius:3px; cursor:pointer;">Hapus</button>
            `;
            wadahKomentar.appendChild(elemen);
        });
    } catch (error) {
        wadahKomentar.innerHTML = '<p style="color:red;"><em>Gagal memuat komentar. Coba refresh halaman.</em></p>';
        console.error('Error:', error);
    }
}

if (formKomentar) {
    formKomentar.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nama = inputNama.value.trim();
        const pesan = inputPesan.value.trim();

        if (!nama || !pesan) return;

        try {
            const resGet = await fetch(`${API_URL}/latest`, {
                headers: { 'X-Master-Key': MASTER_KEY }
            });
            const dataGet = await resGet.json();
            const record = dataGet.record || {};
            const komentarLama = record.komentar || [];

            komentarLama.push({ nama, pesan, waktu: new Date().toISOString() });

            const resPut = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': MASTER_KEY
                },
                body: JSON.stringify({
                    ...record,
                    komentar: komentarLama
                })
            });

            if (resPut.ok) {
                inputNama.value = '';
                inputPesan.value = '';
                muatKomentarOnline();
            }
        } catch (error) {
            alert('Gagal mengirim komentar!');
            console.error('Error:', error);
        }
    });
}

async function hapusKomentarOnline(index) {
    if (!confirm('Yakin ingin menghapus komentar ini?')) return;

    try {
        const resGet = await fetch(`${API_URL}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        const dataGet = await resGet.json();
        const record = dataGet.record || {};
        let komentarList = record.komentar || [];

        komentarList.splice(index, 1);

        const resPut = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': MASTER_KEY
            },
            body: JSON.stringify({
                ...record,
                komentar: komentarList
            })
        });

        if (resPut.ok) {
            muatKomentarOnline();
        }
    } catch (error) {
        alert('Gagal menghapus komentar!');
        console.error('Error:', error);
    }
}

// Inisialisasi saat halaman pertama kali dimuat
muatKomentarOnline();
muatLikeGlobal();