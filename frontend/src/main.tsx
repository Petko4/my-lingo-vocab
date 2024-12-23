import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { SignUpPage } from "./pages/SignUpPage.tsx";
import { SignInPage } from "./pages/SignInPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <AuthProvider>
              <Routes>
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/home" element={<HomePage />} />
              </Routes>
            </AuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
