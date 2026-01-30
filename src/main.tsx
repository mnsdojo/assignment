import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { PrimeReactProvider } from "primereact/api";

// PrimeReact styles
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>,
);
