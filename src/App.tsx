import { createBrowserRouter, RouterProvider } from "react-router-dom";


import { lazy, Suspense } from "react";

import RootLayout from "./components/RootLayout";

import { saveTestCredentials } from "./login-local-storage/LoginData";

import GenerateAdmitPage from "./pages/GenerateAdmitPage";

import Downloads from "./pages/Downloads";

const Home = lazy(() => import("@/pages/Home"));
const Block = lazy(() => import("./pages/Block"));
const Center = lazy(() => import("./pages/Center"));
const Student = lazy(() => import("./pages/Student"));
const SubDivision = lazy(() => import("./pages/SubDivision"));
const Login = lazy(() => import("./pages/Login"));

const Loader = () => <div className="p-6 text-center">Loading...</div>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Suspense fallback={<Loader />}><Home /></Suspense> },
      { path: "block", element: <Suspense fallback={<Loader />}><Block /></Suspense> },
      { path: "school", element: <Suspense fallback={<Loader />}><Center /></Suspense> },
      { path: "student", element: <Suspense fallback={<Loader />}><Student /></Suspense> },
      { path: "subdivision", element: <Suspense fallback={<Loader />}><SubDivision /></Suspense> },
      { path: "download", element: <Suspense fallback={<Loader />}><Downloads /></Suspense> },
    ],
  },
  {
    path: "login",
    element: <Suspense fallback={<Loader />}><Login /></Suspense>,
  },
   {
    path: "generate-admit",
    element: <Suspense fallback={<Loader />}><GenerateAdmitPage /></Suspense>,
  },
]);

function App() {
  saveTestCredentials();
  return <RouterProvider router={router} />;
}

export default App;
