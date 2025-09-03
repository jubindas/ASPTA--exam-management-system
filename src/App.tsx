import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./components/RootLayout";

import Block from "./pages/Block"

import Center from "./pages/Center";

import Student from "./pages/Student";

import Login from "./pages/Login";

import { saveTestCredentials } from "./login-local-storage/LoginData"

import SubDivision from "./pages/SubDivision";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <h1>hi, home</h1> },
      { path: "block", element: <Block /> },
      { path: "center", element: <Center /> },
      { path: "student", element: <Student /> },
       { path: "/subdivision", element: <SubDivision /> },
    ],
  },{
    path: "login",
    element: <Login />
  }
]);

function App() {

  saveTestCredentials();

  return <RouterProvider router={router} />;
}

export default App;
