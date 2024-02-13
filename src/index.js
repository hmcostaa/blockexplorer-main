import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react'

import Block from "./components/Block";
import Transaction from './components/Transaction';


// 2. Add your color mode config
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/block/:blockId",
    element: <Block />,
  },
  {
    path: "/transaction/:txId",
    element: <Transaction />,
  },
  {
    path: "*",
    element: <Navigate to='/' />,
  },
]);

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme} >
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

