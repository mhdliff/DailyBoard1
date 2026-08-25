import { initTugas } from "./tugas.js";
import { initCatatan } from "./catatan.js";
import { initTema } from "./tema.js";
import { initCuaca } from "./cuaca.js";
import { ambilKutipan } from "./kutipan.js";

function mulaiAplikasi() {
  initTugas();

  initCatatan();

  initTema();

  initCuaca();

  ambilKutipan();
}

mulaiAplikasi();
