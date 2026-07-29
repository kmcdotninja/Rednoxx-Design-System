# FHIR Template: Location Hierarchy

## Purpose

This section defines the physical structural blueprint of the HIMS. It details the Canonical Data Schemas used to construct standard JSON structures for the organization hierarchy, specifically focusing on how physical spaces are represented as `Location` resources in the FHIR standard, and their association with `Organization` resources.

## Background

This design satisfies the ticket requirements by:

- Defining the canonical `Organization` and `Location` mapping templates.
- Using `Location.partOf` to represent nested physical subdivisions.
- Associating the top-level facility `Location` with its owning `Organization` via `managingOrganization`.
- Mapping the requested FHIR `Location.physicalType` codes (`wa`, `cl`, and `ro`), while using `bu` for the top-level facility.
- Providing FHIR R4-compliant sample JSON payloads that can serve as implementation templates.

## Architecture

The system utilizes standard HL7 physical types for classification:

- **Root Facility Building**: `physicalType: "bu"` (Building)
- **Ward Isolation Blocks**: `physicalType: "wa"` (Ward)
- **Clinical Spaces**: `physicalType: "ro"` (Room)

### Hierarchy Diagram

Your implementation should follow a hierarchical structure similar to this blueprint:

```text
Organization
└── Location (Hospital)
    ├── Location (Emergency Department)
    │   ├── Location (Ward A)
    │   │   ├── Location (Room 101)
    │   │   └── Location (Room 102)
    │   └── Location (Ward B)
    ├── Location (Radiology Department)
    │   ├── Location (CT Suite)
    │   └── Location (MRI Room)
    └── Location (Outpatient Department)
        ├── Location (Eye Clinic)
        └── Location (Dental Clinic)
```

## Technical Specification

# FHIR Template: Location Hierarchy

## Purpose

This section defines the physical structural blueprint of the HIMS. It details the Canonical Data Schemas used to construct standard JSON structures for the organization hierarchy, specifically focusing on how physical spaces are represented as `Location` resources in the FHIR standard, and their association with `Organization` resources.

## Background

This design satisfies the ticket requirements by:

- Defining the canonical `Organization` and `Location` mapping templates.
- Using `Location.partOf` to represent nested physical subdivisions.
- Associating the top-level facility `Location` with its owning `Organization` via `managingOrganization`.
- Mapping the requested FHIR `Location.physicalType` codes (`wa`, `cl`, and `ro`), while using `bu` for the top-level facility.
- Providing FHIR R4-compliant sample JSON payloads that can serve as implementation templates.

## Architecture

The system utilizes standard HL7 physical types for classification:

- **Root Facility Building**: `physicalType: "bu"` (Building)
- **Ward Isolation Blocks**: `physicalType: "wa"` (Ward)
- **Outpatient Specialist Units**: `physicalType: "cl"` (Clinic)
- **Clinical Spaces**: `physicalType: "ro"` (Room)

### Hierarchy Diagram

Your implementation should follow a hierarchical structure similar to this blueprint:

```text
Organization
└── Location (Hospital)
    ├── Location (Emergency Department)
    │   ├── Location (Ward A)
    │   │   ├── Location (Room 101)
    │   │   └── Location (Room 102)
    │   └── Location (Ward B)
    ├── Location (Radiology Department)
    │   ├── Location (CT Suite)
    │   └── Location (MRI Room)
    └── Location (Outpatient Department)
        ├── Location (Eye Clinic)
        └── Location (Dental Clinic)
```

## Technical Specification

### 1. Target Payloads

These JSON schema templates define each tier of the facility tree, mapping the parent-child dependencies using the `partOf` references and linking to the managing organization.

#### Organization

```json
{
    "resourceType": "Organization",
    "id": "rednox",
    "active": true,
    "name": "Rednox Hospital",
    "address": [
        {
            "use": "work",
            "line": ["123 Medical Drive"],
            "city": "Lekki",
            "district": "Eti-Osa",
            "state": "Lagos"
        }
    ]
}
```

#### Hospital (Top-Level Location)

```json
{
    "resourceType": "Location",
    "id": "main-hospital",
    "identifier": [
        {
            "system": "https://fhir.rednoxx.com/identifiers/organizations",
            "value": "main-hospital"
        }
    ],
    "status": "active",
    "name": "Rednox Main Hospital",
    "address": {
        "use": "work",
        "line": ["123 Medical Drive"],
        "city": "Lekki",
        "district": "Eti-Osa",
        "state": "Lagos"
    },
    "physicalType": {
        "coding": [
            {
                "system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
                "code": "bu",
                "display": "Building"
            }
        ]
    },
    "managingOrganization": {
        "reference": "Organization/rednox"
    }
}
```

#### Department

```json
{
    "resourceType": "Location",
    "id": "radiology",
    "status": "active",
    "name": "Radiology Department",
    "partOf": {
        "reference": "Location/main-hospital"
    }
}
```

#### Ward

```json
{
    "resourceType": "Location",
    "id": "ward-a",
    "status": "active",
    "name": "Ward A",
    "physicalType": {
        "coding": [
            {
                "system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
                "code": "wa",
                "display": "Ward"
            }
        ]
    },
    "partOf": {
        "reference": "Location/radiology"
    }
}
```

#### Clinic

```json
{
    "resourceType": "Location",
    "id": "eye-clinic",
    "status": "active",
    "name": "Eye Clinic",
    "partOf": {
        "reference": "Location/outpatient"
    }
}
```

#### Room

```json
{
    "resourceType": "Location",
    "id": "room-204",
    "status": "active",
    "name": "Room 204",
    "physicalType": {
        "coding": [
            {
                "system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
                "code": "ro",
                "display": "Room"
            }
        ]
    },
    "partOf": {
        "reference": "Location/ward-a"
    }
}
```

### 2. Implementation via Laravel Database Seeders

To distribute this blueprint across local implementations, embed this logic into a programmatic Laravel database seeder class (e.g., `FacilityStructureSeeder.php`).

The seeder code executes the following programmatic workflow:

1. **Retrieve Secure Client Token**: Initiate an M2M authentication flow using the backend's credentials to capture the short-lived bearer token.
2. **Idempotent Structural Checks**: Construct individual request queries using your mapping templates. Use `PUT` requests to specify hardcoded IDs or evaluate whether resources exist before running `POST` configurations to completely avoid generating unwanted duplicate entries in local containers.
3. **Construct the Tree Systematically**: Direct your code to seed sequentially from the top-tier downwards so that parent IDs exist in Medplum before child nodes point to them using `partOf` elements.

### 3. Document and Package the Configuration

Update the Technical Repository File by documenting approved entity payloads and structure maps inside the project's architectural guide.

Alert the Developer Team by committing the new seeder file to Git and notifying developers that they can sync the exact tree configuration by executing the Artisan command:

```bash
docker compose exec backend php artisan db:seed --class=FacilityStructureSeeder
```

## References

- [ValueSet: Nigeria LGAs](https://build.fhir.org/ig/Nigeria-FHIR-Community/2025Connectathon/ValueSet-nigeria-lgas.html)
- [ValueSet: Nigeria States](https://build.fhir.org/ig/Nigeria-FHIR-Community/2025Connectathon/ValueSet-nigeria-states.html)
