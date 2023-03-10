import Error from "./components/Error/Error";
import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router'
import "./main.scss"
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <BrowserRouter>
          <Error/>
          <Router />
      </BrowserRouter>
  </React.StrictMode>,
)
