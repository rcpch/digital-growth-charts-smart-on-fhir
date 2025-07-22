import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import smart from 'fhirclient';

const client = await smart.oauth2.ready();
const patient = await client.patient.read();
console.log("Patient:", patient);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
