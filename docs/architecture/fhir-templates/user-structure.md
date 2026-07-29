# User and Practitioner Structure

This document outlines how users and practitioners are modeled in the EHR system, distinguishing between their identity (who they are) and their operational assignments (what they do and where).

## 1. Schema References

The EHR relies on two primary FHIR resources for user management:

- **Practitioner**: Represents the human being (e.g., Dr. Ada Chukwu). Stores immutable, personal metrics like legal name, gender, birth date, and national identity numbers.
- **PractitionerRole**: Represents an operational assignment (e.g., General Medicine at General OPD). Links a Practitioner to a specific Location, specialty, and schedule.

### Example Profiles

- **Practitioner JSON Profile**

```json
{
    "resourceType": "Practitioner",
    "id": "USE THE SYSTEM ASSIGNED ID HERE",
    "identifier": [
        {
            "system": "https://fhir.rednoxx.com/identifiers/practitioners",
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
            "use": "official",
            "type": {
                "coding": [
                    {
                        "system": "https://sandbox.dhin-hie.org/ig/CodeSystem/patient-identifier-cs",
                        "code": "NIN",
                        "display": "National Identity Number"
                    }
                ]
            },
            "value": "9876897654",
            "assigner": {
                "display": "National Identity Management Commission (NIMC)"
            }
        },
        {
            "use": "official",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "MD",
                        "display": "Medical License number"
                    }
                ]
            },
            "value": "MDCN/12345/2020",
            "assigner": {
                "display": "Medical and Dental Council of Nigeria (MDCN)"
            }
        }
    ],
    "active": true,
    "name": [
        {
            "use": "official",
            "family": "Okafor",
            "given": ["Chinedu", "Obi"],
            "prefix": ["Dr."],
            "suffix": ["MBBS, FWACS"]
        }
    ],
    "telecom": [
        {
            "system": "phone",
            "value": "+234-801-234-5678",
            "use": "mobile"
        },
        {
            "system": "email",
            "value": "chinedu.okafor@hospital.ng",
            "use": "work"
        }
    ],
    "address": [
        {
            "use": "home",
            "type": "both",
            "line": ["No. 15, Allen Avenue"],
            "city": "Ikeja",
            "district": "Lagos Mainland",
            "state": "Lagos",
            "postalCode": "100001",
            "country": "NG"
        }
    ],
    "gender": "male",
    "birthDate": "1985-03-15",
    "photo": [
        {
            "contentType": "image/jpeg",
            "url": "https://hospital.ng/photos/practitioner-123.jpg"
        }
    ],
    "qualification": [
        {
            "identifier": [
                {
                    "system": "https://fhir.rednoxx.com/codes/practitioner-qualifications",
                    "value": "MBBS-UNILAG-2008"
                }
            ],
            "code": {
                "coding": [
                    {
                        "system": "https://fhir.rednoxx.com/codes/practitioner-qualifications",
                        "display": "Bachelor of Medicine, Bachelor of Surgery"
                    }
                ]
            },
            "period": {
                "start": "2008-06-15"
            },
            "issuer": {
                "display": "Medical and Dental Council of Nigeria (MDCN)"
            }
        }
    ],
    "communication": [
        {
            "coding": [
                {
                    "system": "urn:ietf:bcp:47",
                    "code": "en-NG",
                    "display": "English (Nigeria)"
                },
                {
                    "system": "urn:ietf:bcp:47",
                    "code": "yo",
                    "display": "Yoruba"
                },
                {
                    "system": "urn:ietf:bcp:47",
                    "code": "ha",
                    "display": "Hausa"
                },
                {
                    "system": "urn:ietf:bcp:47",
                    "code": "ig",
                    "display": "Igbo"
                }
            ]
        }
    ]
}
```

- **PractitionerRole JSON Profile**

```json
{
    "resourceType": "PractitionerRole",
    "id": "ng-role-obi-001",
    "identifier": [
        {
            "use": "official",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "MD",
                        "display": "Medical License number"
                    }
                ]
            },
            "value": "MDCN/12345/2020",
            "assigner": {
                "display": "Medical and Dental Council of Nigeria (MDCN)"
            }
        }
    ],
    "active": true,
    "period": {
        "start": "2018-09-01",
        "end": "2026-12-31"
    },
    "practitioner": {
        "reference": "Practitioner/dr-chike-obi",
        "display": "Dr. Chike Obi, FWACP"
    },
    "code": [
        {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/practitioner-role",
                    "code": "doctor",
                    "display": "Doctor"
                }
            ]
        }
    ],
    "specialty": [
        {
            "coding": [
                {
                    "system": "http://snomed.info/sct",
                    "code": "394802001",
                    "display": "General Medicine"
                }
            ],
            "text": "General Internal Medicine"
        },
        {
            "coding": [
                {
                    "system": "http://snomed.info/sct",
                    "code": "394579002",
                    "display": "Cardiology"
                }
            ],
            "text": "Cardiology"
        }
    ],
    "location": [
        {
            "reference": "Location/luth-med-block-3",
            "display": "Medical Block, 3rd Floor, Outpatient Clinic"
        },
        {
            "reference": "Location/luth-cardio-ward",
            "display": "Cardiology Ward (Ward 4B)"
        }
    ],
    "availableTime": [
        {
            "daysOfWeek": ["mon", "wed", "fri"],
            "availableStartTime": "08:00:00",
            "availableEndTime": "15:00:00"
        },
        {
            "daysOfWeek": ["tue", "thu"],
            "availableStartTime": "16:00:00",
            "availableEndTime": "20:00:00",
            "description": "Evening Emergency Round"
        }
    ],
    "notAvailable": [
        {
            "description": "Annual Leave / Conference",
            "during": {
                "start": "2026-08-01",
                "end": "2026-08-14"
            }
        }
    ]
}
```

## 2. Database to FHIR Schema Mapping

| Relational DB (Postgres/Laravel) | FHIR Resource    | FHIR Field Path                                                  | Description                                                       |
| :------------------------------- | :--------------- | :--------------------------------------------------------------- | :---------------------------------------------------------------- |
| `users.id` (UUID)                | Practitioner     | `identifier[0].value`                                            | The primary link between the local auth user and the FHIR record. |
| `users.first_name`, `last_name`  | Practitioner     | `name[0].given`, `name[0].family`                                | The legal name of the user.                                       |
| `users.email`, `users.phone`     | Practitioner     | `telecom[system='email'].value`, `telecom[system='phone'].value` | Contact details for the practitioner.                             |
| `users.nin`                      | Practitioner     | `identifier[system='.../nin'].value`                             | National Identity Number.                                         |
| `users.gender`, `users.dob`      | Practitioner     | `gender`, `birthDate`                                            | Demographics.                                                     |
| `role_assignments.role_id`       | PractitionerRole | `code`                                                           | The broad category of the practitioner (e.g., doctor, nurse).     |
| `role_assignments.department_id` | PractitionerRole | `specialty`                                                      | The clinical specialty or department.                             |
| `role_assignments.location_id`   | PractitionerRole | `location`                                                       | The physical facility or clinic location.                         |

## 3. Practitioner vs. PractitionerRole Lifecycle

### When is a PractitionerRole Created?

A `PractitionerRole` should **not** be created automatically the exact second a `Practitioner` is provisioned unless the admin defines their operational assignment during that same action. They have separate lifecycles:

- **The Practitioner Resource (The "Who")**: This represents the human being. It is created once when they are hired or imported into the Laravel local users database. It stores immutable, personal metrics like their legal name, gender, birth date, and national identity number (NIN).

- **The PractitionerRole Resource (The "Where" and "What")**: This represents an operational assignment. It is created the moment an administrator assigns that user to a specific facility location, department, or specialty.

#### Multi-Tenant / Multi-Clinic Edge Cases

Because tertiary hospitals have complex, shifting scheduling matrices, a single practitioner can have multiple active `PractitionerRole` records in the Medplum graph simultaneously. For example:

- If Dr. Ada Chukwu is assigned to the General OPD department on Monday mornings, a `PractitionerRole` is created linking her to `Location/loc-gopd-clinic-1` under the specialty code for Internal Medicine.
- If she also runs a specialty clinic in Dermatology on Thursday afternoons, a second `PractitionerRole` resource is created linking her to the Dermatology clinic location reference.

## 4. Who is Created as a Practitioner?

Not all users in the system require a Practitioner record. The distinction is based on whether they execute clinical actions that mutate the authoritative clinical graph.

### Sync as Practitioners

**Roles**: HIM / Health Record Officers, Doctors, Nurses, Pharmacists, Dentists, Medical Laboratory Scientists.

**Reason**: Because they execute highly regulated clinical actions—such as merging patient records (W-HIM-021), updating verified national identifiers (W-HIM-017), processing legal record releases (W-HIM-028), and correcting document indices (W-HIM-027)—they mutate the authoritative clinical graph. Their actions require clinical provenance and legal accountability tracking via FHIR `AuditEvent` and `Provenance` resources. Therefore, they must have a corresponding `Practitioner` identity.

### Do NOT Sync as Practitioners

**Roles**: Receptionists, Front Desk Officers, Cashiers, IT Admins.

**Reason**: These are strictly operational and administrative roles. Their actions (e.g., checking in an appointment, sorting a walk-in queue, or taking cash payments) live completely inside the relational Postgres monolith layer. They do not write data straight into the clinical note or observation graphs.

## 5. Specialty and Role Codes

Different professions have different identifier assigners, codes, and specialties. When creating a `PractitionerRole` or `Practitioner`, you must use the appropriate taxonomy and licensing boards.

You can reference standard codes from the [HL7 PractitionerRole CodeSystem](http://terminology.hl7.org/CodeSystem/practitioner-role) or [SNOMED CT](https://browser.ihtsdotools.org/). If you aren't sure of a code, check the [FHIR PractitionerRole ValueSet](http://hl7.org/fhir/valueset-practitioner-role.html) to find the correct standard.

### Examples

**Pharmacist**

- Code: `pharmacist`
- System: `http://terminology.hl7.org/CodeSystem/practitioner-role`
- Assigner: Pharmacists Council of Nigeria (PCN)

**Nurse**

- Code: `nurse`
- System: `http://terminology.hl7.org/CodeSystem/practitioner-role`
- Assigner: Nursing and Midwifery Council of Nigeria (NMCN)

**Dentist**

- Code: `dentist`
- System: `http://terminology.hl7.org/CodeSystem/practitioner-role`
- Assigner: Medical and Dental Council of Nigeria (MDCN)

**Medical Laboratory Scientist**

- Code: `159016003` (Medical laboratory technician) or a more specialized SNOMED code.
- System: `http://snomed.info/sct`
- Assigner: Medical Laboratory Science Council of Nigeria (MLSCN)
