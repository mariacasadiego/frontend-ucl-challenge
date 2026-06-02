import ReactDOM from "react-dom/client";
import App from "./App";
import { Providers } from "./app/providers";

import "./shared/styles/globals.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
  </Providers>,
);
