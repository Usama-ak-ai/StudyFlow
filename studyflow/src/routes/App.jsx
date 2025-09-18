import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import Header from "../components/Header";

import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header></Header>
      <Outlet />
    </>
  );
}

export default App;
