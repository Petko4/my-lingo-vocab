import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Router, Routes } from "react-router";
import { SignUpPage } from "./pages/SignUpPage.tsx";
import { SignInPage } from "./pages/SignInPage.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { App } from "./App.tsx";
import { PrivateRoute } from "./components/PrivateRoute.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  // <BrowserRouter>
  //   <Routes>
  //     {/* Public routes */}

  //     {/* Protected routes */}
  //     <Route
  //       path="/*"
  //       element={
  //         <AuthProvider>
  //           <Routes>
  //           <Route path="/signup" element={<SignUpPage />} />
  //             <Route path="/signin" element={<SignInPage />} />
  //             <Route path="/app/*" element={<App />} />
  //           </Routes>
  //         </AuthProvider>
  //       }
  //     />
  //   </Routes>
  // </BrowserRouter>
  // </StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/app/*" element={<App />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
