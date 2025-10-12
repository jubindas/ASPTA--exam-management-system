import React, { lazy, Suspense } from "react";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/provider/authContext";

import { useAuth } from "./hooks/useAuth";

import RootLayout from "./components/RootLayout";

const Home = lazy(() => import("@/pages/Home"));

const Block = lazy(() => import("./pages/Block"));

const Center = lazy(() => import("./pages/Center"));

const Student = lazy(() => import("./pages/Student"));

const SubDivision = lazy(() => import("./pages/SubDivision"));

const Login = lazy(() => import("./pages/Login"));

const Loader = lazy(() => import("./components/Loader"));

const GenerateAdmitPage = lazy(() => import("./pages/GenerateAdmitPage"));

const Downloads = lazy(() => import("./pages/Downloads"));




const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user || !token) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) return <Loader />;
  if (user && token) return <Navigate to="/" replace />;

  return <>{children}</>;
};


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "block",
        element: (
          <Suspense fallback={<Loader />}>
            <Block />
          </Suspense>
        ),
      },
      {
        path: "school",
        element: (
          <Suspense fallback={<Loader />}>
            <Center />
          </Suspense>
        ),
      },
      {
        path: "student",
        element: (
          <Suspense fallback={<Loader />}>
            <Student />
          </Suspense>
        ),
      },
      {
        path: "subdivision",
        element: (
          <Suspense fallback={<Loader />}>
            <SubDivision />
          </Suspense>
        ),
      },
      {
        path: "download",
        element: (
          <Suspense fallback={<Loader />}>
            <Downloads />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "login",
    element: (
      <PublicRoute>
        <Suspense fallback={<Loader />}>
          <Login />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: "generate-admit",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loader />}>
          <GenerateAdmitPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
