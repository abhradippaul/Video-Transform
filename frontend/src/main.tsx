import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import QueryClient_Provider from "./providers/queryclient-provider.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClient_Provider>
      <App />
    </QueryClient_Provider>
  </BrowserRouter>
);
