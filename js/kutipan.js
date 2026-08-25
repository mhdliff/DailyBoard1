const kutipanElement = document.getElementById("kutipan-harian");
const statusKutipan = document.getElementById("status-kutipan");
const refreshKutipan = document.getElementById("refresh-kutipan");

async function ambilKutipan() {
  try {

    statusKutipan.textContent = "Mengambil kutipan...";

    const response = await fetch(
      "https://dummyjson.com/quotes/random"
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil kutipan.");
    }

    const data = await response.json();

    kutipanElement.textContent =
      `"${data.quote}" — ${data.author}`;

    statusKutipan.textContent = "";
  } catch (error) {
    kutipanElement.textContent = "Kutipan tidak dapat dimuat.";
    statusKutipan.textContent = error.message;
  }
}

if (refreshKutipan) {
  refreshKutipan.addEventListener("click", ambilKutipan);
}


export { ambilKutipan };