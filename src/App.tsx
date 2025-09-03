import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./components/RootLayout";

import Block from "./pages/Block"

import Center from "./pages/Center";
import Student from "./pages/Student";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "home", element: <h1>hi, home</h1> },
      { path: "block", element: <Block /> },
      { path: "center", element: <Center /> },
      { path: "student", element: <Student /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
