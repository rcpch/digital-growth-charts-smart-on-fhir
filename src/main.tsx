import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import smart from 'fhirclient';
import type { fhirR5 } from '@smile-cdr/fhirts'

const GROWTH_API_BASEURL: string = import.meta.env.VITE_APP_GROWTH_API_BASEURL;
const GROWTH_API_KEY: string = import.meta.env.VITE_APP_API_KEY;

const client = await smart.oauth2.ready();

if (!client.patient.id) {
  console.error("Failed to initialize FHIR client. Missing patient ID.");
  throw new Error("FHIR client initialization failed. Missing patient ID.");
}

const loincCodeToMeasurementMethod: { [key: string]: string } = {
  '29463-7': 'weight', // weight
  '3141-9' : 'weight', // weight
  '8302-2' : 'height', // Body height
  '8306-3' : 'height', // Body height --lying
  '8287-5' : 'ofc',    // headCircumference
}

async function fetchObservations(patientId: string): Promise<fhirR5.Observation[]> {
  const query = new URLSearchParams();
  query.set("patient", patientId);
  query.set("_count", "100"); // Try this to fetch fewer pages
  query.set("code", Object.keys(loincCodeToMeasurementMethod).map(c => `http://loinc.org|${c}`).join(","));

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

function getSex(patient: fhirR5.Patient): 'male' | 'female' {
  switch(patient.gender) {
    case 'male':
      return 'male';

    case 'female':
      return 'female';

    default:
      throw new Error(`Unsupported patient sex ${patient.gender}`)
  }
}

async function callAPIForObservation(patient: fhirR5.Patient, observation: fhirR5.Observation): Promise<any> {
  if(!observation.code || !observation.code.coding || observation.code.coding.length === 0 || !observation.code.coding[0].code) {
    throw new Error(`Missing code for observation ${observation.id}`);
  }

  const measurement_method = loincCodeToMeasurementMethod[observation.code.coding[0].code];
  if(!measurement_method) {
    throw new Error(`Unsupported LOINC code ${observation.code.coding[0].code} for observation ${observation.id}`);
  }

  if(!patient.birthDate) {
    throw new Error(`Patient ${patient.id} does not have a birth date`);
  }

  if(!observation.effectiveDateTime) {
    throw new Error(`Observation ${observation.id} does not have an effectiveDateTime`);
  }

  if(!observation.valueQuantity || !observation.valueQuantity.value) {
    throw new Error(`Observation ${observation.id} does not have a valueQuantity with a value`);
  }

  // API requires you to send T00:00:00Z
  const observationDate = `${observation.effectiveDateTime?.split("T")[0]}T00:00:00Z`;

  const response = await fetch(`${GROWTH_API_BASEURL}/uk-who/calculation`, {
    method: 'POST',
    headers: {
      'Subscription-Key': GROWTH_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      birth_date: patient.birthDate,
      observation_date: observationDate,
      observation_value: observation.valueQuantity.value,
      sex: getSex(patient),
      gestation_weeks: 40,
      gestation_days: 0,
      measurement_method
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

let [patient, observations] = await Promise.all([
  fetchPatient(),
  fetchObservations(client.patient.id)
]);

const measurements = await Promise.all(observations.map(obs => callAPIForObservation(patient, obs)));

const measurementObject: { [key: string]: any[] } = {
  height: [],
  weight: [],
  ofc: []
};

for(const measurement of measurements) {
  const key = measurement.child_observation_value.measurement_method;

  measurementObject[key].push(measurement);
}

console.log("Patient:", patient);
console.log("Observations:", observations);
console.log("Measurements:", measurements);
console.log("Measurement Object:", measurementObject);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App
      title={getTitle(patient) || "Growth Chart"}
      sex={getSex(patient)}
      measurements={measurementObject}
    />
  </StrictMode>,
)
