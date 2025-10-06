import { Locale } from "../../../../../i18n-config";

// --- Locales Data ---
const locales: {
  code: Locale;
  label: string;
  flag: JSX.Element;
}[] = [
  {
    code: "en",
    label: "English (EN)",
    flag: <USFlag />,
  },
  {
    code: "id",
    label: "Bahasa Indonesia (ID)",
    flag: <IDFlag />,
  },
];

// --- Flag Components ---
function USFlag() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 7410 3900"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <rect width="7410" height="3900" fill="#b22234" />
      <g fill="#fff">
        <rect width="7410" height="300" y="300" />
        <rect width="7410" height="300" y="900" />
        <rect width="7410" height="300" y="1500" />
        <rect width="7410" height="300" y="2100" />
        <rect width="7410" height="300" y="2700" />
        <rect width="7410" height="300" y="3300" />
      </g>
      <rect width="2964" height="2100" fill="#3c3b6e" />
      <g fill="#fff">
        <g id="star">
          <polygon points="247,90 322,390 72,150 422,150 172,390" />
        </g>
        <g id="row">
          <use href="#star" key="s1" />
          <use href="#star" x="494" key="s2" />
          <use href="#star" x="988" key="s3" />
          <use href="#star" x="1482" key="s4" />
          <use href="#star" x="1976" key="s5" />
        </g>
        {Array.from({ length: 8 }).map((_, i) => (
          <use href="#row" y={210 * (i + 1)} key={`r${i}`} />
        ))}
      </g>
    </svg>
  );
}

function IDFlag() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <rect width="640" height="240" fill="#ff0000" />
      <rect width="640" height="240" y="240" fill="#ffffff" />
    </svg>
  );
}


export default locales;
