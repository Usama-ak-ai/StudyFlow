import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index.js";

import "./index.css";
import App from "./routes/App.jsx";
import Main from "./routes/MainPart.jsx";
import Timer from "./components/Timer.jsx";
import ProgressChart from "./components/ProgressChart.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Main /> },
      {
        path: "/timer",
        element: <Timer />,
      },
      {
        path: "/progress-chart",
        element: <ProgressChart />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
