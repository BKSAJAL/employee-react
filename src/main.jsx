import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";

function PageWrapper({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        draggable
      />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PageWrapper>
      <App />
    </PageWrapper>
  </StrictMode>
);
