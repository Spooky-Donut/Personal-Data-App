import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/index.css";
import App from "./App.tsx";
import Crear from "./components/Crear.tsx";
import Consulta from "./components/Consulta.tsx";
import Editar from "./components/Editar.tsx";
import Borrar from "./components/Borrar.tsx";
import Logs from "./components/Logs.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <h1>404 Not Found</h1>,
  },
  {
    path: "/crear",
    element: <Crear />,
  },
  {
    path: "/consulta",
    element: <Consulta />,
  },
  {
    path: "/editar",
    element: <Editar />,
  },
  {
    path: "/borrar",
    element: <Borrar />,
  },
  {
    path: "/logs",
    element: <Logs />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
