const BAHASA_INDONESIA: Record<string, string> = {
  sejarah_bahasa_indonesia: "",
  kedudukan_fungsi: "",
  diksi: "",
  paragraf: "",
  kalimat: "",
  karangan: "",
};

const LOGIKA_MATEMATIKA: Record<string, string> = {
  proposisi: "",
  tabel_kebenaran: "",
};

const DASAR_PEMROGRAMAN_PYTHON: Record<string, string> = {
  install_python: "",
  sintaks_dasar: "",
};

const KALKULUS: Record<string, string> = {
  pengenalan_kalkulus: "",
  bilangan_kompleks: "",
  modulus: "",
  turunan: "",
};

const DOCS_ITEMS: Record<
  string,
  string | { title: string; items: Record<string, string> }
> = {
  tentang: "",
  bahasa_indonesia: {
    title: "Bahasa Indonesia",
    items: BAHASA_INDONESIA,
  },
  logika_matematika: {
    title: "Logika Matematika",
    items: LOGIKA_MATEMATIKA,
  },
  kalkulus: {
    title: "Kalkulus",
    items: KALKULUS,
  },
  dasar_pemrograman_python: {
    title: "Dasar Pemrograman Python",
    items: DASAR_PEMROGRAMAN_PYTHON,
  },
};

const ROUTES = {
  index: {
    title: "Home",
    type: "page",
  },
  docs: {
    title: "Documentation",
    type: "page",
    items: DOCS_ITEMS,
  },
};

export default ROUTES;
