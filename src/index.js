import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import NewAdmin from "./components/NewAdmin";
// import AppData from "./AppData";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
        <BrowserRouter>
          <Router />
          {/* <AppData/> */}
          {/* <NewAdmin/> */}
        </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();
