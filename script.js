const STORAGE_KEY = 'pmr-entries';
let entries = [];
let situasiVal = 'Upacara';

const form = document.getElementById('form');
const submitBtn = document.getElementById('submit-btn');
const dataWrap = document.getElementById('data-wrap');
const rekapWrap = document.getElementById('rekap-wrap');
const searchEl = document.getElementById('search');
const filterEl = document.getElementById('filter-situasi');

document.getElementById('f-tanggal').valueAsDate = new Date();

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
    });
});

document.querySelectorAll('.situasi-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.situasi-toggle button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        situasiVal = btn.dataset.val;
    });
});

async function loadEntries() {
    try {
        const res = await window.storage.get(STORAGE_KEY, true);
        entries = res && res.value ? JSON.parse(res.value) : [];
    } catch (e) {
        entries = [];
    }
    render();
}

async function saveEntries() {
    try {
        await window.storage.set(STORAGE_KEY, JSON.stringify(entries), true);
    } catch (e) {
        console.error('Gagal menyimpan data', e);
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
}

function fmtDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderStats() {
    document.getElementById('stat-total').textContent = entries.length;
    document.getElementById('stat-upacara').textContent = entries.filter(e => e.situasi === 'Upacara').length;
    document.getElementById('stat-harian').textContent = entries.filter(e => e.situasi === 'Hari Biasa').length;
}

function getFiltered() {
    const q = searchEl.value.trim().toLowerCase();
    const filt = filterEl.value;
    const sorted = [...entries].sort((a, b) => (b.tanggal + b.id) > (a.tanggal + a.id) ? 1 : -1);
    return sorted.filter(e => {
        const matchQ = !q || e.nama.toLowerCase().includes(q) || e.kelas.toLowerCase().includes(q);
        const matchF = filt === 'Semua' || e.situasi === filt;
        return matchQ && matchF;
    });
}

function renderDataTable() {
    const filtered = getFiltered();
    if (filtered.length === 0) {
        dataWrap.innerHTML = `<div class="empty">Belum ada catatan yang cocok. Isi form di tab "Catat Baru".</div>`;
        return;
    }
    const rows = filtered.map(e => {
        const badgeClass = e.situasi.replace(' ', '-');
        return `
      <tr>
        <td class="tgl">${fmtDate(e.tanggal)}${e.jam ? '<br>' + escapeHtml(e.jam) : ''}</td>
        <td class="nama">${escapeHtml(e.nama)}</td>
        <td class="kelas">${escapeHtml(e.kelas)}</td>
        <td><span class="badge ${badgeClass}">${e.situasi}</span></td>
        <td class="ket">${escapeHtml(e.keluhan)}</td>
        <td class="ket">${escapeHtml(e.penanganan)}</td>
        <td><button class="del-btn" title="Hapus" data-id="${e.id}">✕</button></td>
      </tr>`;
    }).join('');

    dataWrap.innerHTML = `
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Tanggal</th><th>Nama</th><th>Kelas</th><th>Situasi</th><th>Keluhan</th><th>Penanganan</th><th></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

    dataWrap.querySelectorAll('.del-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            entries = entries.filter(e => String(e.id) !== String(id));
            renderAll();
            await saveEntries();
        });
    });
}

function renderRekap() {
    if (entries.length === 0) {
        rekapWrap.innerHTML = `<div class="empty">Belum ada data untuk direkap.</div>`;
        return;
    }
    const map = {};
    entries.forEach(e => {
        const k = e.kelas.trim() || '(Tanpa kelas)';
        if (!map[k]) map[k] = { total: 0, upacara: 0, harian: 0 };
        map[k].total++;
        if (e.situasi === 'Upacara') map[k].upacara++; else map[k].harian++;
    });
    const kelasList = Object.keys(map).sort((a, b) => map[b].total - map[a].total);

    const rows = kelasList.map(k => {
        const d = map[k];
        return `<tr>
      <td class="kelas-rekap">${escapeHtml(k)}</td>
      <td class="num-cell">${d.total}</td>
      <td class="num-cell">${d.upacara}</td>
      <td class="num-cell">${d.harian}</td>
    </tr>`;
    }).join('');

    const totalAll = entries.length;
    const totalUpacara = entries.filter(e => e.situasi === 'Upacara').length;
    const totalHarian = entries.filter(e => e.situasi === 'Hari Biasa').length;

    rekapWrap.innerHTML = `
    <div class="table-scroll">
      <table style="min-width:420px;">
        <thead>
          <tr><th>Kelas</th><th>Total Kasus</th><th>Saat Upacara</th><th>Hari Biasa</th></tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr><td>Total</td><td class="num-cell">${totalAll}</td><td class="num-cell">${totalUpacara}</td><td class="num-cell">${totalHarian}</td></tr>
        </tfoot>
      </table>
    </div>`;
}

function renderAll() {
    renderStats();
    renderDataTable();
    renderRekap();
}

function toCsvValue(v) {
    const s = (v == null ? '' : String(v)).replace(/"/g, '""');
    return `"${s}"`;
}

function downloadCsv(filename, header, rows) {
    const csv = [header.map(toCsvValue).join(',')]
        .concat(rows.map(r => r.map(toCsvValue).join(',')))
        .join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.getElementById('export-data').addEventListener('click', () => {
    const filtered = getFiltered();
    downloadCsv('catatan-pmr.csv',
        ['Tanggal', 'Jam', 'Nama', 'Kelas', 'Situasi', 'Keluhan', 'Penanganan'],
        filtered.map(e => [fmtDate(e.tanggal), e.jam, e.nama, e.kelas, e.situasi, e.keluhan, e.penanganan])
    );
});

document.getElementById('export-rekap').addEventListener('click', () => {
    const map = {};
    entries.forEach(e => {
        const k = e.kelas.trim() || '(Tanpa kelas)';
        if (!map[k]) map[k] = { total: 0, upacara: 0, harian: 0 };
        map[k].total++;
        if (e.situasi === 'Upacara') map[k].upacara++; else map[k].harian++;
    });
    const kelasList = Object.keys(map).sort((a, b) => map[b].total - map[a].total);
    downloadCsv('rekap-per-kelas.csv',
        ['Kelas', 'Total Kasus', 'Saat Upacara', 'Hari Biasa'],
        kelasList.map(k => [k, map[k].total, map[k].upacara, map[k].harian])
    );
});

form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Menyimpan...';

    const entry = {
        id: Date.now(),
        nama: document.getElementById('f-nama').value.trim(),
        kelas: document.getElementById('f-kelas').value.trim(),
        situasi: situasiVal,
        tanggal: document.getElementById('f-tanggal').value,
        jam: document.getElementById('f-jam').value.trim(),
        keluhan: document.getElementById('f-keluhan').value.trim(),
        penanganan: document.getElementById('f-penanganan').value.trim(),
    };

    entries.push(entry);
    renderAll();
    await saveEntries();

    form.reset();
    document.getElementById('f-tanggal').valueAsDate = new Date();
    document.querySelectorAll('.situasi-toggle button').forEach(b => b.classList.remove('active'));
    document.querySelector('.situasi-toggle button[data-val="Upacara"]').classList.add('active');
    situasiVal = 'Upacara';

    submitBtn.disabled = false;
    submitBtn.textContent = 'Catat kasus';

    document.querySelector('.tab-btn[data-tab="data"]').click();
});

searchEl.addEventListener('input', renderDataTable);
filterEl.addEventListener('change', renderDataTable);

loadEntries();