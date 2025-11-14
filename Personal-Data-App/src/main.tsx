import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/index.css";
import App from "./App.tsx";
import Crear from "./Crear.tsx";
import Consulta from "./Consulta.tsx";
import Editar from "./Editar.tsx";
import Borrar from "./Borrar.tsx";
import Logs from "./Logs.tsx";

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
