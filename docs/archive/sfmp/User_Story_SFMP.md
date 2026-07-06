# User Story Suite for Enhancement of SFMP Branding and Onboarding

| Field | Detail |
| --- | --- |
| **Component Name** | Sustainable Finance Marketplace |
| **BRD/SWR/TIR Document Number** | — |
| **General Description** | The document details the optimization of onboarding and application process of the SFMP platform |
| **Target Audience** | Developers │ QA Testers │ Product Managers |
| **Date Created** | 07 April 2026 |

## Review and Approval

| Role | Name |
| --- | --- |
| **Created by** | Olusile Falusi |
| **Reviewed by** | Oluwarotimi Adeyanju |
| **Approved by** | Oluwaseyi Okunnuga |

> **Security Notice:** The information contained within this document is **CONFIDENTIAL**. Unauthorized disclosure is prohibited. Failure to observe Sterling Bank guidelines regarding proprietary details can result in disciplinary action, including dismissal, and can subject you and/or third parties to legal liability.

**Handling Guidelines** *(Tick all that apply)*

- Do not forward or copy data in part or full without explicit permission from **Sterling Bank**.
- Limit access to individuals on the Access List / Lock in a Drawer / Cabinet.
- Password-protect when emailed outside Sterling Bank's Network / Send password separately.

---

## Section 1 — Edits on Borrower Profile

### 1. Project Creation

**As a** \<Borrower\> **I want** to upload required documents into clearly labelled fields based on the selected loan type **so that** I can ensure all required documents are correctly submitted and organized for review.

**Process Flow**

1. Upon log-in, user navigates to **Projects** → **On Market Place** and selects **Create New Project**.
2. System returns available industry categories: Health, Education, Agriculture, Renewable Energy, Transport, Others.
3. User selects sector and **Continue**.
4. The application page is displayed with three segments: **Details**, **Supporting Document**, and **Additional Details**.
5. **Details** displays a form for the applicant to provide a brief of the project in the fields below:
   - Name of Project
   - Project Description
   - Facility Type (Solar Home System, Commercial and Industrial Projects, Isolated Mini Grid Projects, Interconnected Mini-Grids)
   - Facility Amount
   - Purpose
   - Tenor
   - Moratorium Requirement
   - Domiciliation Arrangement
   - Equity Contribution
   - Source of Repayment
6. User selects **Continue** and system displays the supporting document page.
7. User uploads supporting documents in each section (sample):
   - Proposed Project / Transaction
   - Credibility / Credit Worthiness
   - Project Execution, Revenue Generation and Repayment
   - Sustainability Requirement
   - Sector Overview
   - Product Specification
   - Supply Analysis
   - Demand Analysis
   - Pricing Requirements
   - Sales and Marketing Plan
   - Critical Success Factors *(Hubuk to rename)*
   - Proposed Security
   - Inherent Risk

**Acceptance Criteria**

- Available industry categories are configurable by the admin — the bouquet displayed for the applicant are categories previously configured by the admin.
- The facility type is configurable by the admin for each sector / industry category, and the Details page returns only what has been previously configured by the admin.
- The **Facility Type** dropdown should contain a tool-tip on each item during navigation so the applicant / borrower is aligned on the nomenclature of the facility they are applying for.
- Tool tip displayed for **Equity Contribution** is *"minimum of 20% contribution"*.
- Where a value below 20 is inputted for equity contribution, the system should gracefully and clearly reject and direct the user to *"enter a value from 20"*.
- The **Selected Sector** tab on the details page is replaced with **Facility Type**, as the application currently speaks to one sector type for now. This should be consistent across all borrower / financier / admin interfaces.
- The **Supporting Documents** page has the **Facility Type** header and an arrow to return to the previous page in case the wrong facility type was selected. This should be consistent across all borrower / financier / admin interfaces.
- The **Supporting Documents** page should contain upload fields for each supporting document for the facility type.
- **Other** under supporting documents should allow multiple uploads.
- Where any field is missing, an attempt to submit should highlight missing fields and direct the user to complete them before proceeding.
- The description of each supporting document should be displayed on the tool tip of the info icon to keep the page tidy.
- Where project creation is in progress and the application times out, the system should save progress made and store it under projects with an *"in progress"* icon.
- All documents uploaded should be categorised in the applicable section selected during upload.

**Other Information**

*Tool tips for Financing Type:*

- **Solar Home System:** For solar vendors to scale deployment through aggregated demand, offering lease-to-own or pay-as-you-go options while the Bank funds the vendors.
- **Commercial and Industrial Projects:** A structured financing solution for renewable energy transition for commercial and industrial companies.
- **Isolated Mini Grid Projects:** For rural electrification with repayments tied to project cashflows.
- **Interconnected Mini Grid Projects:** For interconnected mini-grids that enhance grid reliability using distributed renewable energy integrated with existing DISCO infrastructure and billing systems.

*Mandatory Documents for Each Facility Type:*

**Solar Home System**
- Memorandum and Articles of Association
- CAC status report
- Audited Financial statements (minimum 3 years, where available)
- Business plan, including pipeline of customers
- Use of proceeds breakdown
- Vendor quotation / system specifications
- Evidence of distribution network and operational capacity
- Others

**Commercial and Industrial Projects**
- Memorandum and Articles of Association
- CAC status report
- Audited financial statements (2–3 years)
- Management accounts (where applicable)
- Energy audit report / load assessment
- Technical system design and specifications
- EPC contract / developer agreement
- Corporate Governance structure
- Others

**Isolated Mini Grid Projects**
- Memorandum and Articles of Association
- CAC status report
- Feasibility study and business plan
- Load assessment and demand analysis
- Community engagement agreements (Exclusivity agreement, PPA, Deed of assignment)
- Tariff model and regulatory approvals (where applicable)
- Developer's track record and CVs of management team — alternatively, any document that speaks to these would suffice
- Technical design and system specifications
- Grant application status or evidence of grant approval from REA
- Financial model demonstrating project viability
- Others

**Interconnected Mini Grid Projects**
- Memorandum and Articles of Association
- CAC status report
- Feasibility study and project business plan
- Load assessment and network analysis
- Interconnection agreement with DISCO
- Power Purchase Agreement (PPA) or service agreement
- Tariff structure and regulatory approvals
- Developer track record and technical capability
- Technical design and integration plan
- Financial model demonstrating project viability
- Others

### 2. Message Filter

**As a** \<borrower, financier, admin\> **I want to** apply value search or date filter on my messages **so that** I can streamline messages from multiple sources.

**Process Flow**

1. Upon log in, user navigates to the **Messages** menu.
2. System displays **Inbox** and **Sent** tabs.
3. Each view should have a date filter and search bar to streamline messages within each tab.

**Acceptance Criteria**

- Messages in each tab should be paginated; search and date filter should call the database and not just the UI page.
- Search should be by value (e.g. "financier", "Hubuk", "50000"), not limited to role, name, amount, or time.

---

## Section 2 — Edits on Admin Profile

### 1. Create New Sector

**As an** \<Admin\> **I want** to create a new sector **so that** I can expand the financing reach of the application.

**Process Flow**

1. Upon log in, admin navigates to **Sector**.
2. Admin can create a new sector, edit an existing sector, or edit a new sector.
3. To create a sector, Admin selects **Create New Sector**.
4. System displays a screen to enter the name of the sector.
5. Admin enters the name of the sector and adds a list of facility types before proceeding to save the new sector.
6. The newly created sector appears on the list of sectors on the admin initiator page.

**Acceptance Criteria**

- The **Facility Types** are input fields with an **Add More** function.
- Only sector creations that have been further edited with project detail fields will be moved to the authoriser for approval; only upon authoriser approval would the sector be visible on the borrower workflow.
- All sector creations are saved only on the admin initiator view for further edits.

### 2. Edit Existing Sector

**As an** \<Admin\> **I want** to edit sector requirements of an existing sector **so that** I can align the application with internal and regulatory changes.

**Process Flow**

1. Admin selects an existing sector item.
2. System returns all sector requirements in the following segments: Facility Type, Project Details, Supporting Documents, Additional Requirement.
3. Where **Facility Type** is selected, system returns all facility types created for that sector and allows admin to **add**, **edit**, and **delete**.
4. Where **Project Details** is selected, system returns all project detail fields for that sector in their various sections *(refer to Section 1.1, Ph 7 above)* and allows admin to **add**, **edit**, and **delete**. The **Add** field presents the form:
   - Field Name
   - Section *(refer to Section 1.1, Ph 7 above)*
   - Description
   - Field Type (Text, Document, Number, Percentage)
5. **Edit** field presents an editable version of the form previously filled at the point it was being added.
6. **Delete** field returns a confirmatory modal and saves the request until the initiator completes all segments.
7. Where **Supporting Document** is selected, Step 4 above is repeated.
8. Where **Additional Requirement** is selected, Step 4 above is repeated.

**Acceptance Criteria**

- All fields of an existing sector are editable, and changes are saved on the admin initiator view only for each segment where the admin saves and continues.
- Changes are only sent for approval when the admin initiator has reached the end of the form and selected **Submit Changes**.
- Changes only reflect on borrower / financier / admin authoriser views when the admin authoriser has approved changes on its approval queue.
- Where changes are approved, Text, Number, or Percentage-based fields are retained in the section that was selected during creation (where the change was to *add field*).
- Text, Number, or Percentage-based fields are retained in the original section before the edit (where the change was to *edit field* and no change was made to the section).
- Document-based fields are retained in the **Supporting Document** segment.
- A value-based search feature should be applied to each segment / page of the sector fields.
- The **Section** field should allow both input of value and dropdown suggestions for the user to select values previously entered. The user can select an item from the dropdown and the section field is autofilled with the item selected.
- Where the user inputs an item not previously in the dropdown, the section field accepts the entry and registers it as a new section field option.
- Project field descriptions should be displayed as an info accordion across all interfaces for a tidier rendition (i.e. displayed only when the info icon is selected).

### 3. Edit New Sector

**As an** \<Admin\> **I want** to edit sector requirements of a newly created sector **so that** I can publish it across the application's user interfaces.

**Process Flow**

1. Admin selects the sector just created in *Section 2.1, Ph 3*.
2. System returns all sector requirements in the following segments: Facility Type, Project Details, Supporting Documents, Additional Requirement.
3. Where **Facility Type** is selected, the system returns the *Facility Type* segment page for admin to **add facility type**.
4. Admin enters the required facility type and selects **Save and Continue**.
5. System returns the **Project Details** page with an option to add *Project Detail* fields.
6. Admin selects **Add Project Details** and system returns a form:
   - Field Name
   - Section
   - Description
   - Field Type (Text, Document, Number, Percentage)
7. Admin completes the form and adds as many fields as required.
8. Admin selects **Save and Continue** at the end of the page.
9. System returns the **Additional Requirements** page for admin's preview.
10. Admin selects **Submit Change**.
11. System directs all changes to the approval queue of the admin authoriser.

**Acceptance Criteria**

- **Add Facility Type** returns an input field with an **Add More** function that returns as many facility type input fields as the user desires.
- Text, Number, or Percentage-based fields are retained in the Project Details segment.
- Document-based fields are retained in the **Supporting Document** segment.
- There is a default additional field after all fields have been created.
- A value-based search feature should be applied to each segment / page of the sector fields.
- Each section entry is saved as a dropdown option for future use. The user can select an item from the dropdown and the section field is autofilled with the item selected.
- Where the user inputs an item not previously in the dropdown, the section field accepts the entry and registers it as a new section field option.

---

## Section 3 — UI and Branding Edits

### 1. Application

**As a** \<system\> **I want to** reflect the updated brand positioning of the application **so that** I can attract a wider range of users.

**Acceptance Criteria**

- All references to Sterling X CBN should be deleted and replaced with **Sustainable Financial Market Place (SFMP)**.
- **Powered by Sterling** should be retained to comply with regulatory standards.
- All Sterling logos and existing partner logos (such as CBN) should be deleted and replaced with the SFMP logo.
- The application interface is to be aligned with SFMP brand guidelines *(changes should be made only where the brand guidelines provided do not align with work already done)*.

---

## Section 4 — Standards for Default Adherence

| S/N | Feature | Actor | User Story | Acceptance Criteria |
| --- | --- | --- | --- | --- |
| 1 | Login | User | **As a** User **I want** to log in using valid credentials **so that** I can access my dashboard. | User enters valid username & password; login is successful and user sees the dashboard. |
| 2 | Login | User | **As a** User **I want** to be denied access when I enter a valid username but invalid password **so that** unauthorized access is prevented. | User sees an "Invalid credentials" error message; login fails. |
| 3 | Login | User | **As a** User **I want** to be denied access when I enter an invalid username even if the password is correct **so that** unauthorized access is prevented. | System displays "User does not exist" error; login fails. |
| 4 | Login | User | **As a** User **I want** to be denied access when both username and password are incorrect **so that** unauthorized access is prevented. | Error message shown: "Invalid credentials"; login attempt is blocked. |
| 5 | Login | User | **As a** User **I want** to be prompted to fill in required fields if I leave username or password blank **so that** unauthorized access is prevented. | Prompt/error appears indicating missing fields; user is prevented from proceeding. |
| 6 | Login | User | **As a** User **I want** to log in using biometrics **so that** I can access my account without typing credentials. | Biometric verification (fingerprint/facial) grants access (where applicable); dashboard is displayed after a successful scan. |
| 7 | Login | User | **As a** User **I want** the app to require login again after logout, even if I try to use the back button **so that** unauthorized access is prevented. | After logout, navigating back still shows the login screen; session remains invalidated. |
| 8 | 2FA | User | **As a** User **I want** an extra layer of authentication via OneToken after entering my credentials **so that** unauthorized access is prevented. | User is prompted for OneToken PIN; access is granted only with a valid PIN. |
| 9 | 2FA | User | **As a** User **I want** to be denied login if I enter an invalid OneToken PIN **so that** unauthorized access is prevented. | Login is denied; error shown for invalid OneToken. |
| 10 | 2FA | User | **As an** Admin user **I want** to use a second factor of authentication to access admin features **so that** unauthorized access is prevented. | Admin login requires credentials + additional factor; access denied without second factor. |
| 11 | Session Management | User | **As a** User **I want** my session to time out after 5 minutes of inactivity **so that** unauthorized access is prevented. | After 5 mins of inactivity, session ends; returning prompts login again. |
| 12 | Session Management | User | **As a** User **I want** to be denied access to the app after timeout when using the back button **so that** unauthorized access is prevented. | After timeout, back navigation requires fresh login. |
| 13 | Session Management | User | **As a** User **I want** the app to log me out securely, denying access even if I use the browser's back button **so that** unauthorized access is prevented. | App requires re-login after logout; no session restored via back navigation. |
| 14 | Exception Logging | User | **As a** developer / Applications Support personnel / QA user **I want** all exceptions to be logged **so that** issues can be traced. | Logs contain all exceptions with necessary details; accessible via log path (file) and database (MongoDB); ElasticSearch is implemented for real-time logs output/access. |
| 15 | Exception Logging | User | **As a** developer / App Support / QA user **I want** exception logs to follow a standard format **so that** I can interpret logs output easily for troubleshooting. | Format: refID │ Error Code │ Error Description │ Exception │ AffectedPage │ Module │ DateTimeAdded. |
| 16 | Audit Trail | User | **As an** auditor user **I want** to access audit trails of user activities on the app **so that** I can track all user actions for forensic audit. | All user actions are recorded; logs viewable via audit path; implemented in database (Mongo). |
| 17 | Audit Trail | User | **As an** auditor user **I want** audit logs to be in a standard format for compliance **so that** historical user actions are easy to interpret. | Format: ClientMachine IP Address │ Username │ ApplicationModuleName │ ActivityDescription │ DateCreated │ OtherFields. |
| 18 | Encryption | User | **As a** security engineer user **I want** sensitive data like passwords and tokens to be encrypted **so that** user and transactional data are protected as mandated by regulation. | In databases (Passwords, OTPs, 2FA Tokens, and BVNs are encrypted); encryption standard to be AES-256. |
| 19 | Usability | User | **As a** User **I want** the application UI to adapt to my device size **so that** my user experience is not compromised on portable devices. | UI is responsive on mobile, tablet, desktop, and large (e.g. projector) screens. |
| 20 | Usability | User | **As a** User **I want** content (images, text, forms) to be well aligned **so that** my user experience is not compromised. | Proper alignment and padding of all UI components. |
| 21 | Usability | User | **As a** User **I want** input fields to constrain text within their control boundaries **so that** my user experience is not compromised. | No overflow from input fields during typing. |
| 22 | Usability | User | **As a** User **I want** readable text with appropriate font, color, and contrast **so that** my user experience is not compromised. | Legible and visually accessible UI. |
| 23 | Usability | User | **As a** User **I want** a consistent design across the entire app **so that** my user experience is not compromised. | Colors, fonts, and spacing remain uniform. |
| 24 | Usability | User | **As a** User **I want** all application buttons and icons to be visually distinct **so that** my user experience is not compromised. | Interactive elements are clearly styled and distinct. |
| 25 | Usability | User | **As a** User **I want** the app to remain responsive without excessive loading time **so that** my user experience is not compromised. | Smooth transitions; minimal delays. |
| 26 | Injection | User | **As a** security analyst user **I want** user input to be sanitized **so that** injection attacks are prevented. | SQL/script injection attempts are rejected and (when server-side) logged. |
| 27 | Token Authentication | User | **As a** User **I want** authentication methods to be robust **so that** unauthorized access is prevented. | Valid logins succeed, invalid logins fail; lockout after multiple failed attempts. |
| 28 | Access Control | User | **As a** User **I want** to be denied access to features not authorized to my role **so that** application integrity is not compromised. | Role-based access control prevents unauthorized actions. |
| 29 | Security Configuration | User | **As a** system administrator user **I want** the app to be securely configured **so that** application integrity is not compromised. | No default passwords; proper HTTP security headers in place; no hardcoded secret keys in client-side JavaScript files; use environment variables and secure key management so keys are not hardcoded; generate and manage IVs dynamically for each encryption operation and avoid reusing IVs; disable OpenAPI (Swagger) documentation on non-QA environments. |
| 30 | Data Validation | User | **As a** User **I want** user detail fields (e.g. email, phone number, and account number) to be validated correctly **so that** clean data is persisted and the user experience is not compromised. | Email follows standard format; phone number permits 11 digits for non-country-code fields and 10 digits for country-code-prefixed fields; account number permits 10 digits only; enter a valid Sterling Bank account number in fields requiring this to check acceptance; enter an invalid Sterling Bank account number to check validation. |

---

*Copyright © Sterling Bank 2024*
