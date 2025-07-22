import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import FHIRClient from 'fhirclient';

const client = FHIRClient.client("https://r3.smarthealthit.org");
client.request("Patient").then(console.log).catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
