export function validasiInput(nilai) {
  const teks = nilai.trim();

  if (teks === "") {
    alert("Input tidak boleh kosong!");
    return false;
  }

  if (teks.length > 50) {
    alert("Input maksimal 50 karakter!");
    return false;
  }

  return true;
}

export function debounce(callback, delay = 300) {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
