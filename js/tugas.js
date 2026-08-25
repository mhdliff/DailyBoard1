import { validasiInput, debounce } from "./utils.js";

let daftarTugas = [
  { id: 1, nama: "Belajar JavaScript", selesai: false },
  { id: 2, nama: "Olahraga pagi", selesai: false }
];

let nextId = 3;
let filterAktif = "semua";
let kataKunciPencarian = "";
let tugasYangSedangDiDrag = null;
let clickTimer = null;

const formTugas = document.getElementById("form-tugas");
const inputTugas = document.getElementById("input-tugas");
const daftarTugasElement = document.getElementById("daftar-tugas");
const tombolFilter = document.querySelectorAll("[data-filter]");
const inputPencarian = document.getElementById("cari-tugas");

function simpanTugasKeStorage() {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function muatTugasDariStorage() {
  const data = localStorage.getItem("daftarTugas");

  if (!data) return;

  try {
    daftarTugas = JSON.parse(data);

    if (daftarTugas.length > 0) {
      nextId = Math.max(...daftarTugas.map(tugas => tugas.id)) + 1;
    }
  } catch {
    daftarTugas = [];
  }
}

function renderTugas() {
  daftarTugasElement.innerHTML = "";

  const tugasTersaring = daftarTugas.filter(tugas => {
    const cocokStatus =
      filterAktif === "semua" ||
      (filterAktif === "selesai" && tugas.selesai) ||
      (filterAktif === "belum" && !tugas.selesai);

    const cocokPencarian =
      tugas.nama.toLowerCase().includes(kataKunciPencarian);

    return cocokStatus && cocokPencarian;
  });

  tugasTersaring.forEach(tugas => {
    const li = document.createElement("li");
    li.className = "tugas-item";
    li.dataset.id = tugas.id;
    li.draggable = true;

    const nama = document.createElement("span");
    nama.className = "tugas-nama";
    nama.textContent = tugas.nama;
    nama.title = "Klik untuk selesai, double click untuk edit";

    if (tugas.selesai) {
      nama.classList.add("tugas-selesai");
    }

    nama.addEventListener("click", () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
        return;
      }

      clickTimer = setTimeout(() => {
        toggleSelesai(tugas.id);
        clickTimer = null;
      }, 250);
    });

    nama.addEventListener("dblclick", () => {
      clearTimeout(clickTimer);
      clickTimer = null;
      editTugas(tugas.id);
    });

    const tombolHapus = document.createElement("button");
    tombolHapus.className = "btn-hapus";
    tombolHapus.textContent = "Hapus";

    tombolHapus.addEventListener("click", () => hapusTugas(tugas.id));

    li.addEventListener("dragstart", () => {
      tugasYangSedangDiDrag = tugas.id;
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      tugasYangSedangDiDrag = null;
      li.classList.remove("dragging");
    });

    li.addEventListener("dragover", event => event.preventDefault());

    li.addEventListener("drop", event => {
      event.preventDefault();

      const targetId = Number(li.dataset.id);

      if (
        tugasYangSedangDiDrag === null ||
        tugasYangSedangDiDrag === targetId
      ) {
        return;
      }

      pindahkanTugas(tugasYangSedangDiDrag, targetId);
    });

    li.append(nama, tombolHapus);
    daftarTugasElement.appendChild(li);
  });
}


function tambahTugas(nama) {
  if (!validasiInput(nama)) return;

  daftarTugas.push({
    id: nextId++,
    nama: nama.trim(),
    selesai: false
  });

  simpanTugasKeStorage();
  renderTugas();
}

function hapusTugas(id) {
  daftarTugas = daftarTugas.filter(tugas => tugas.id !== id);

  simpanTugasKeStorage();
  renderTugas();
}

function toggleSelesai(id) {
  daftarTugas = daftarTugas.map(tugas =>
    tugas.id === id
      ? { ...tugas, selesai: !tugas.selesai }
      : tugas
  );

  simpanTugasKeStorage();
  renderTugas();
}

function editTugas(id) {
  const tugas = daftarTugas.find(tugas => tugas.id === id);
  if (!tugas) return;

  const namaBaru = prompt("Ubah nama tugas:", tugas.nama);

  if (namaBaru === null || !validasiInput(namaBaru)) return;

  daftarTugas = daftarTugas.map(tugas =>
    tugas.id === id
      ? { ...tugas, nama: namaBaru.trim() }
      : tugas
  );

  simpanTugasKeStorage();
  renderTugas();
}

function pindahkanTugas(idYangDipindah, idTujuan) {
  const indexAwal = daftarTugas.findIndex(t => t.id === idYangDipindah);
  const indexTujuan = daftarTugas.findIndex(t => t.id === idTujuan);

  if (indexAwal === -1 || indexTujuan === -1) return;

  const [tugasDipindah] = daftarTugas.splice(indexAwal, 1);
  daftarTugas.splice(indexTujuan, 0, tugasDipindah);

  simpanTugasKeStorage();
  renderTugas();
}


function initTugas() {
  formTugas.addEventListener("submit", event => {
    event.preventDefault();
    tambahTugas(inputTugas.value);
    inputTugas.value = "";
    inputTugas.focus();
  });

  tombolFilter.forEach(tombol => {
    tombol.addEventListener("click", () => {
      filterAktif = tombol.dataset.filter;
      renderTugas();
    });
  });

  const cariTugasDebounced = debounce(keyword => {
    kataKunciPencarian = keyword.toLowerCase().trim();
    renderTugas();
  }, 300);

  inputPencarian.addEventListener("input", event => {
    cariTugasDebounced(event.target.value);
  });

  muatTugasDariStorage();
  renderTugas();
}

export { initTugas };
