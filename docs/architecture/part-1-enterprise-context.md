# PART I: Enterprise Context

## Purpose

This comprehensive, highly technical blueprint establishes the absolute engineering, configuration, and implementation specification for the Rednoxx EHR V1 platform. It serves as the definitive personal source of truth to govern the architecture, generate downstream team documentation, and enforce the engineering baseline across all sprints.

## Scope

The scope of this architecture document covers the complete 26-week delivery lifecycle of the Rednoxx platform. It aligns the strategic target architecture with the operational boundaries, clinical safety guidelines, and commercial requirements outlined in the AGILE DELIVERY PLAN.docx.

## EA Operational Mandate & Document Utilization

This document acts as the centralized engine for architecture governance. It will be utilized to:

- Generate specialized markdown artifacts (e.g., ADRs, runbooks, module boundaries) for individual sprint teams.
- Maintain strict alignment with interoperability frameworks, ensuring our canonical models map flawlessly to HL7 FHIR and openEHR principles.
- Drive the creation of Dockerized local development sandboxes and TypeScript-based Medplum bots for the engineering teams.

## Guiding Principles

- **Separation of Concerns:** Financial and operational transactional consistency must remain strictly separated from clinical data models and event workflows.
- **No Direct Database Coupling:** To preserve transactional integrity and enforce compliance boundaries, the system establishes a strict data partitioning line.
- **Standards Conformance:** All clinical data models must adhere to strict interoperability standards using a native FHIR framework.

## Architecture Goals

- Bridge the healthcare industry's historical incentive gap between billing and clinical care.
- Completely eliminate the emergence of isolated health information silos within the facility.
- Architect a robust backend leveraging Node.js and Postgres for high-volume transactions, seamlessly integrated with the Medplum clinical graph.

## Constraints

- There are no direct cross-database writes permitted between the relational engine and the clinical graph.

## Assumptions

- The tertiary hospital environment requires strict Role-Based Access Control (RBAC) matrices to govern user permissions safely.
- Infrastructure disruptions will occur, requiring the system to support degraded-state paper fallback procedures.

## Definitions & Normalized Terminology

- **Postgres:** The authoritative relational database engine used for financial, operational, and identity management storage.
- **Medplum:** The authoritative FHIR server, configurable clinical repository, and clinical automation engine.
- **Master Patient Index (MPI):** The canonical demographic and identity registry for all patients within the clinical core.

## Stakeholders

- **Enterprise Architecture Team:** Responsible for maintaining this source of truth and the canonical data model.
- **Clinical & HIM Officers:** Responsible for the integrity of the Master Patient Index and clinical workflows.
- **Billing & Finance Officers:** Responsible for tariff rule configuration and claims generation.

## References

- AGILE DELIVERY PLAN.docx.
