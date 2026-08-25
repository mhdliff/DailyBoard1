const tombolTema = document.getElementById("toggle-tema");

function terapkanTema() {
  const modeGelap = localStorage.getItem("tema") === "gelap";

  document.body.classList.toggle("dark-mode", modeGelap);

  tombolTema.textContent = modeGelap ? "Mode Terang" : "Mode Gelap";
}

function initTema() {
  tombolTema.addEventListener("click", () => {
    const sedangGelap = document.body.classList.toggle("dark-mode");

    localStorage.setItem(
      "tema",
      sedangGelap ? "gelap" : "terang"
    );

    terapkanTema();
  });

  terapkanTema();
}

export { initTema };
