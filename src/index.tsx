import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./pages/Homepage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import History from "./pages/History";
import { store } from "./stores";
import { Provider } from "react-redux";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "history",
    element: <History />,
  },
]);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
