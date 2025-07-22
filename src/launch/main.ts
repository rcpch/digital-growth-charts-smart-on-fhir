import smart from 'fhirclient';

console.log("RCPCH Growth Charts - SMART on FHIR launch");

smart.oauth2.authorize({
    clientId: "my_web_app",

    // The scopes that you request from the EHR. In this case we want to:
    // launch            - Get the launch context
    // openid & fhirUser - Get the current user
    // patient/Observation.read - Read observations for the patient
    // patient/Patient.read - Read the patient resource
    scope: "launch openid fhirUser patient/Observation.read patient/Patient.read",

    // Typically, if your redirectUri points to the root of the current directory
    // (where the launchUri is), you can omit this option because the default value is
    // ".". However, some servers do not support directory indexes so "." and "./"
    // will not automatically map to the "index.html" file in that directory.
    redirectUri: "index.html"
});