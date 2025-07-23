import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import smart from 'fhirclient';
import type { fhirR5 } from '@smile-cdr/fhirts'

const client = await smart.oauth2.ready();

if (!client.patient.id) {
  console.error("Failed to initialize FHIR client. Missing patient ID.");
  throw new Error("FHIR client initialization failed. Missing patient ID.");
}

async function fetchObservations(patientId: string): Promise<fhirR5.Observation[]> {
  const query = new URLSearchParams();
  query.set("patient", patientId);
  query.set("_count", "100"); // Try this to fetch fewer pages
  query.set("code", [
      'http://loinc.org|29463-7', // weight
      'http://loinc.org|3141-9' , // weight
      'http://loinc.org|8302-2' , // Body height
      'http://loinc.org|8306-3' , // Body height --lying
      'http://loinc.org|8287-5' , // headC
      'http://loinc.org|39156-5', // BMI 39156-5
      'http://loinc.org|18185-9', // gestAge
      'http://loinc.org|37362-1', // bone age
      'http://loinc.org|11884-4'  // gestAge
  ].join(","));

  const observations = await client.request("Observation?" + query, {
      pageLimit: 0,   // get all pages
      flat     : true // return flat array of Observation resources
  });

  return observations;
}

async function fetchPatient(): Promise<fhirR5.Patient> {
  return client.patient.read();
}

function getTitle(patient: fhirR5.Patient): string | undefined {
  if (patient.name && patient.name.length > 0) {
    let given = "";

    if( patient.name[0].given && patient.name[0].given.length > 0) {
      given = patient.name[0].given.join(" ");
    }
    
    return `${given} ${patient.name[0].family} [${patient.id}]`;
  }

  return patient.id;
}

const [patient, observations] = await Promise.all([
  fetchPatient(),
  fetchObservations(client.patient.id)
]);

console.log("Patient:", patient);
console.log("Observations:", observations);

const title = getTitle(patient) || "Growth Chart";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App
      title={title}
    />
  </StrictMode>,
)
