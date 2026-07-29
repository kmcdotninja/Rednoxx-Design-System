# Master Patient Index (MPI)

## Purpose

This section defines the canonical data schema for patient identity management within the HIMS. It outlines how patient demographics and various identification documents are represented using the FHIR `Patient` resource, ensuring a reliable Master Patient Index (MPI) that prevents duplicate records and supports robust identity verification across clinical and administrative workflows.

## Alternative Methods of Identification

To ensure comprehensive identity tracking and resolve duplicate records, our system supports various methods of identification beyond the primary national identity number (NIN). Each identifier is mapped to specific FHIR identifier systems and codes:

- **International Passports**: Primarily captured to support foreign patient workflows, tracking nationality, local residency details, and international payer categories safely. (Code: `PPN`)
- **National Driver's Licenses**: Utilized as a standard regional identity verification document for domestic residents who lack or cannot recall their primary credentials. (Code: `DL`)
- **INEC Permanent Voter's Cards (PVC)**: Handled as a widely available alternative domestic identity document to run demographic match checks at the front desk. (Code: `VIN`)
- **Birth Certificate Numbers**: Specifically integrated to handle identity verification layers for neonates, children, and minor registration workflows before a legal name or national identification has been provisioned. (Code: `BR`)
- **National Health Insurance Authority (NHIA) / HMO Payer IDs**: Captured conditionally separately from core demographics to manage eligibility, pre-authorizations, and coverage tracking boundaries. (Code: `NHIS`)
- **Legacy Medical Record Numbers (MRN)**: Preserved and indexed during data migration loops or paper-scanned file ingestion to ensure historical patient charts remain searchable. (Code: `MR`)
- **Mobile Phone Numbers**: Handled as an alternative provider-assigned identifier (`PRN`) for tracking patients when official IDs are unavailable.
- **Temporary Emergency Identifiers**: Provisioned for immediate emergency intakes (`TAX`).
- **Anonymous Identifiers / Pseudonyms**: Used for privacy-preserving, restricted, or unknown patient registrations (`ANON`).

## Additional Demographic Data

In addition to core demographics, the profile supports:
- **Emergency Contacts**: Tracked in the `contact` array with relationship codes (e.g., `C` for Emergency Contact).
- **Religion and Ethnicity**: Captured via custom FHIR extensions (`http://fhir.rednoxx.com/extension/patient-religion` and `http://fhir.rednoxx.com/extension/patient-ethnicity`).
- **Managing Organization**: Linking the patient to the primary facility or overarching health network.

## FHIR Schema References

The primary resource for the Master Patient Index is the **Patient** resource.

### Example Profile

Here is a comprehensive `Patient` JSON profile demonstrating how these alternative identifiers, demographics, contacts, and extensions are captured:

```json
{
    "resourceType": "Patient",
    "id": "USE THE SYSTEM ASSIGNED ID HERE",
    "identifier": [
        {
            "system": "https://fhir.rednoxx.com/identifiers/patients",
            "value": "PASTE_THE_LARAVEL_USERS_UUID_HERE"
        },
        {
            "use": "official",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "NI",
                        "display": "National Identity Number"
                    }
                ]
            },
            "system": "http://id.nhcr.gov.ng/namespaces/nin",
            "value": "12345678901",
            "assigner": {
                "display": "National Identity Management Commission (NIMC)"
            }
        },
        {
            "use": "secondary",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "NHIS",
                        "display": "National Health Insurance Scheme"
                    }
                ]
            },
            "system": "http://id.nhcr.gov.ng/namespaces/nhia",
            "value": "NHIA-NG-5544332211"
        },
        {
            "use": "usual",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "MR",
                        "display": "Medical Record Number"
                    }
                ]
            },
            "system": "https://fhir.rednoxx.com/identifiers/mrn",
            "value": "LGH-2024-8899"
        },
        {
            "use": "official",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "PPN",
                        "display": "Passport number"
                    }
                ]
            },
            "system": "https://fhir.rednoxx.com/identifiers/passports",
            "value": "A12345678",
            "assigner": {
                "display": "Nigeria Immigration Service (NIS)"
            }
        },
        {
            "use": "official",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "DL",
                        "display": "Driver's license number"
                    }
                ]
            },
            "system": "https://fhir.rednoxx.com/identifiers/drivers-licenses",
            "value": "ABC123456789",
            "assigner": {
                "display": "Federal Road Safety Corps (FRSC)"
            }
        },
        {
            "use": "official",
            "type": {
                "coding": [
                    {
                        "system": "https://fhir.rednoxx.com/codes/identifier-types",
                        "code": "VIN",
                        "display": "Permanent Voter's Card Number"
                    }
                ]
            },
            "system": "https://fhir.rednoxx.com/identifiers/voters-cards",
            "value": "90F5B12345678901234",
            "assigner": {
                "display": "Independent National Electoral Commission (INEC)"
            }
        },
        {
            "use": "official",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "BR",
                        "display": "Birth registry number"
                    }
                ]
            },
            "system": "https://fhir.rednoxx.com/identifiers/birth-certificates",
            "value": "NPC-BC-2026-9988",
            "assigner": {
                "display": "National Population Commission (NPC)"
            }
        },
        {
            "use": "usual",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "PRN",
                        "display": "Provider assigned number"
                    }
                ]
            },
            "system": "https://fhir.rednoxx.com/identifiers/mobile-phones",
            "value": "2348012345678"
        },
        {
            "use": "temp",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "TAX",
                        "display": "Temporary Account Number"
                    }
                ]
            },
            "system": "https://fhir.rednoxx.com/identifiers/emergency",
            "value": "TEMP-EMERG-20260720-0045"
        },
        {
            "use": "anonymous",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "ANON",
                        "display": "Anonymous identifier"
                    }
                ]
            },
            "system": "https://fhir.rednoxx.com/identifiers/pseudonyms",
            "value": "PSEUDO-HASH-HEX-998877"
        }
    ],
    "active": true,
    "name": [
        {
            "use": "official",
            "family": "Okafor",
            "given": ["Chinwe", "Ngozi"],
            "text": "Chinwe Ngozi Okafor"
        }
    ],
    "telecom": [
        {
            "system": "phone",
            "value": "+2348012345678",
            "use": "mobile",
            "rank": 1
        },
        {
            "system": "phone",
            "value": "+2348098765432",
            "use": "home",
            "rank": 2
        }
    ],
    "gender": "female",
    "birthDate": "1985-03-15",
    "address": [
        {
            "use": "home",
            "line": ["123 Medical Drive"],
            "city": "Lekki",
            "district": "Eti-Osa",
            "state": "Lagos"
        }
    ],
    "maritalStatus": {
        "coding": [
            {
                "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
                "code": "M",
                "display": "Married"
            }
        ]
    },
    "contact": [
        {
            "relationship": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v2-0131",
                            "code": "C",
                            "display": "Emergency Contact"
                        }
                    ]
                }
            ],
            "name": {
                "family": "Okafor",
                "given": ["Emeka"],
                "text": "Emeka Okafor (Husband)"
            },
            "telecom": [
                {
                    "system": "phone",
                    "value": "+2348098765432",
                    "use": "mobile"
                }
            ],
            "address": [
                {
                    "use": "home",
                    "line": ["123 Medical Drive"],
                    "city": "Lekki",
                    "district": "Eti-Osa",
                    "state": "Lagos"
                }
            ],
            "period": {
                "start": "2010-05-20"
            }
        }
    ],
    "communication": [
        {
            "language": {
                "coding": [
                    {
                        "system": "urn:ietf:bcp:47",
                        "code": "en-NG",
                        "display": "English (Nigeria)"
                    }
                ]
            },
            "preferred": true
        },
        {
            "language": {
                "coding": [
                    {
                        "system": "urn:ietf:bcp:47",
                        "code": "yo",
                        "display": "Yoruba"
                    }
                ]
            },
            "preferred": false
        },
        {
            "language": {
                "coding": [
                    {
                        "system": "urn:ietf:bcp:47",
                        "code": "ha",
                        "display": "Hausa"
                    }
                ]
            },
            "preferred": false
        },
        {
            "language": {
                "coding": [
                    {
                        "system": "urn:ietf:bcp:47",
                        "code": "ig",
                        "display": "Igbo"
                    }
                ]
            },
            "preferred": false
        }
    ],
    "extension": [
        {
            "url": "http://fhir.rednoxx.com/extension/patient-religion",
            "valueCodeableConcept": {
                "coding": [
                    {
                        "code": "CHRISTIANITY",
                        "display": "Christianity"
                    }
                ]
            }
        },
        {
            "url": "http://fhir.rednoxx.com/extension/patient-ethnicity",
            "valueCodeableConcept": {
                "coding": [
                    {
                        "code": "IGBO",
                        "display": "Igbo"
                    }
                ]
            }
        }
    ],
    "managingOrganization": {
        "reference": "Organization/lagos-general-hospital",
        "display": "Lagos General Hospital"
    }
}
```

## Database to FHIR Schema Mapping

| Relational DB (Postgres/Laravel) | FHIR Resource | FHIR Field Path | Description |
| :--- | :--- | :--- | :--- |
| `patients.id` (UUID) | Patient | `identifier[system='.../patients'].value` | The primary link between the local user UUID and the FHIR record. |
| `patients.first_name`, `last_name` | Patient | `name[0].given`, `name[0].family` | The legal name of the patient. |
| `patients.email`, `patients.phone` | Patient | `telecom[system='email'].value`, `telecom[system='phone'].value` | Contact details for the patient. |
| `patients.dob` | Patient | `birthDate` | Date of birth. |
| `patients.gender` | Patient | `gender` | Demographics. |
| `patient_identities.type = 'nin'` | Patient | `identifier[type.coding.code='NI'].value` | National Identity Number (NIN). |
| `patient_identities.type = 'passport'` | Patient | `identifier[type.coding.code='PPN'].value` | International Passports (Foreign workflows/nationality). |
| `patient_identities.type = 'drivers_license'`| Patient | `identifier[type.coding.code='DL'].value` | National Driver's Licenses (Domestic ID verification). |
| `patient_identities.type = 'pvc'` | Patient | `identifier[type.coding.code='VIN'].value` | INEC Permanent Voter's Cards (Demographic match checks). |
| `patient_identities.type = 'birth_cert'` | Patient | `identifier[type.coding.code='BR'].value` | Birth Certificate Numbers (Neonates/minors). |
| `patient_identities.type = 'nhia'` | Patient | `identifier[type.coding.code='NHIS'].value` | NHIA / HMO Payer IDs (Eligibility & coverage). |
| `patient_identities.type = 'mrn'` | Patient | `identifier[type.coding.code='MR'].value` | Legacy Medical Record Numbers (Data migration). |
| `patient_identities.type = 'emergency'`| Patient | `identifier[type.coding.code='TAX'].value` | Temporary emergency numbers for intake. |
| `patient_identities.type = 'pseudonym'`| Patient | `identifier[type.coding.code='ANON'].value` | Anonymous identifiers for privacy-preserving registration. |
| `patient_demographics.religion` | Patient | `extension[url='.../patient-religion'].valueCodeableConcept` | Religion extension mapping. |
| `patient_demographics.ethnicity` | Patient | `extension[url='.../patient-ethnicity'].valueCodeableConcept` | Ethnicity extension mapping. |
| `emergency_contacts.*` | Patient | `contact` | Maps to the emergency contact details. |
