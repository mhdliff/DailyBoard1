import { validasiInput } from "./utils.js";

let daftarCatatan = [];

const formCatatan = document.getElementById("form-catatan");
const inputCatatan = document.getElementById("input-catatan");
const daftarCatatanElement = document.getElementById("daftar-catatan");

function simpanCatatanKeStorage() {
  localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
}

function muatCatatanDariStorage() {
  const data = localStorage.getItem("daftarCatatan");

  if (!data) return;

  try {
    daftarCatatan = JSON.parse(data);
  } catch {
    daftarCatatan = [];
  }
}

function renderCatatan() {
  daftarCatatanElement.innerHTML = "";

  daftarCatatan.forEach(catatan => {
    const card = document.createElement("div");
    card.className = "catatan-item";

    const isi = document.createElement("p");
    isi.className = "catatan-isi";
    isi.textContent = catatan.isi;
    isi.title = "Double click untuk edit catatan";
    isi.addEventListener("dblclick", () => editCatatan(catatan.id));

    const tanggal = document.createElement("small");
    tanggal.className = "catatan-tanggal";
    tanggal.textContent = catatan.tanggal;

    const actions = document.createElement("div");
    actions.className = "catatan-actions";

    const tombolHapus = document.createElement("button");
    tombolHapus.className = "btn-hapus-catatan";
    tombolHapus.textContent = "Hapus";

    tombolHapus.addEventListener("click", () => hapusCatatan(catatan.id));

    actions.appendChild(tombolHapus);
    card.append(isi, tanggal, actions);
    daftarCatatanElement.appendChild(card);
  });
}

function tambahCatatan(isi) {
  if (!validasiInput(isi)) return;

  daftarCatatan.push({
    id: Date.now(),
    isi: isi.trim(),
    tanggal: new Date().toLocaleString("id-ID")
  });

  simpanCatatanKeStorage();
  renderCatatan();
}

function editCatatan(id) {
  const catatan = daftarCatatan.find(catatan => catatan.id === id);
  if (!catatan) return;

  const isiBaru = prompt("Ubah catatan:", catatan.isi);

  if (isiBaru === null || !validasiInput(isiBaru)) return;

  daftarCatatan = daftarCatatan.map(catatan =>
    catatan.id === id
      ? { ...catatan, isi: isiBaru.trim() }
      : catatan
  );

  simpanCatatanKeStorage();
  renderCatatan();
}

function hapusCatatan(id) {
  daftarCatatan = daftarCatatan.filter(catatan => catatan.id !== id);

  simpanCatatanKeStorage();
  renderCatatan();
}

function initCatatan() {
  formCatatan.addEventListener("submit", event => {
    event.preventDefault();
    tambahCatatan(inputCatatan.value);
    inputCatatan.value = "";
    inputCatatan.focus();
  });

  muatCatatanDariStorage();
  renderCatatan();
}

export { initCatatan };
