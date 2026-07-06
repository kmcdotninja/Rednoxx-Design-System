import type {
  Approval,
  AuditEntry,
  BorrowerProfile,
  Community,
  Domain,
  DocSection,
  FacilityType,
  FileRef,
  FinancierProfile,
  LoanApplication,
  Meeting,
  Message,
  NotificationItem,
  Persona,
  Project,
  RangeSeries,
  Sector,
  TimeRange,
} from './types'
import { DOMAIN_META } from './nav'

/* --------------------------- shared constants ----------------------------- */

export const BORROWER_CO = DOMAIN_META.borrower.company // Helios Renewables Ltd
export const FINANCIER_CO = DOMAIN_META.financier.company // Meridian Capital Partners
export const ADMIN_CO = DOMAIN_META.admin.company // SFMP · Sterling Bank

export const SECTOR_CATEGORIES = [
  'Health',
  'Education',
  'Agriculture',
  'Renewable Energy',
  'Transport',
  'Others',
] as const

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export const CURRENT_USERS: Record<Domain, { name: string; firstName: string; email: string }> = {
  borrower: { name: 'Amara Okonkwo', firstName: 'Amara', email: 'a.okonkwo@heliosrenewables.ng' },
  financier: { name: 'Tunde Bakare', firstName: 'Tunde', email: 't.bakare@meridiancapital.ng' },
  admin: { name: 'Ngozi Eze', firstName: 'Ngozi', email: 'n.eze@sfmp.sterling.ng' },
}

/* ------------------ deterministic chart series (for dashboards) ----------- */

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const DISBURSEMENT_SERIES = [
  180, 210, 195, 240, 260, 255, 300, 320, 310, 360, 390, 420,
]
export const PIPELINE_SERIES = [4, 6, 5, 8, 7, 10, 9, 12, 11, 14, 13, 16]

/* ---- time-range series (Day / Month / Year) for the trend charts ---- */

const DAY_LABELS = Array.from({ length: 30 }, (_, i) => `Jun ${i + 1}`)
const YEAR_LABELS = ['2021', '2022', '2023', '2024', '2025', '2026']

/** Borrower — requested facility value (₦m). */
export const BORROWER_PIPELINE_RANGES: Record<TimeRange, RangeSeries> = {
  day: {
    labels: DAY_LABELS,
    data: [
      910, 930, 925, 960, 985, 970, 1010, 1035, 1020, 1060,
      1045, 1090, 1075, 1120, 1140, 1125, 1170, 1155, 1200, 1230,
      1215, 1260, 1245, 1290, 1320, 1305, 1350, 1380, 1365, 1410,
    ],
  },
  month: { labels: MONTHS, data: PIPELINE_SERIES.map((v) => v * 90) },
  year: { labels: YEAR_LABELS, data: [180, 340, 560, 780, 1080, 1440] },
}

/** Financier — funds committed (₦m). */
export const DISBURSEMENT_RANGES: Record<TimeRange, RangeSeries> = {
  day: {
    labels: DAY_LABELS,
    data: [
      620, 640, 635, 665, 655, 690, 705, 695, 730, 720,
      755, 745, 780, 800, 790, 825, 815, 850, 870, 860,
      895, 885, 920, 940, 930, 965, 955, 990, 1010, 1000,
    ],
  },
  month: { labels: MONTHS, data: DISBURSEMENT_SERIES.map((v) => v * 3) },
  year: { labels: YEAR_LABELS, data: [140, 260, 430, 640, 900, 1260] },
}

/** Admin — daily marketplace activity for the interactive bar chart
 *  (last 3 months, deterministic). */
export const MARKET_ACTIVITY: { label: string; submissions: number; funded: number }[] = Array.from(
  { length: 91 },
  (_, i) => {
    const d = new Date(2026, 3, 1 + i) // Apr 1 – Jun 30, 2026
    const wave = Math.sin(i / 5.2) + Math.sin(i / 11.7)
    const submissions = Math.max(1, Math.round(6 + 3.4 * wave + (i % 7 === 3 ? 3 : 0) + (i % 3)))
    const funded = Math.max(0, Math.round(3 + 2.1 * Math.sin(i / 6.8 + 1.3) + (i % 5 === 2 ? 2 : 0)))
    return {
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      submissions,
      funded,
    }
  },
)

/** Admin — projects flowing through the marketplace (count). */
export const ADMIN_PIPELINE_RANGES: Record<TimeRange, RangeSeries> = {
  day: {
    labels: DAY_LABELS,
    data: [
      0, 1, 0, 2, 1, 1, 3, 2, 1, 2,
      3, 2, 4, 3, 2, 4, 3, 5, 4, 3,
      5, 4, 6, 5, 4, 6, 5, 7, 6, 8,
    ],
  },
  month: { labels: MONTHS, data: PIPELINE_SERIES },
  year: { labels: YEAR_LABELS, data: [12, 22, 35, 54, 78, 104] },
}

/* --------------------------- document taxonomies -------------------------- */

const common = (extra: DocSection[]): DocSection[] => [
  { id: 'moa', name: 'Memorandum & Articles of Association', description: 'The company’s registered MEMART evidencing incorporation and objects.' },
  { id: 'cac', name: 'CAC status report', description: 'Current Corporate Affairs Commission status report for the company.' },
  ...extra,
  { id: 'inherent_risk', name: 'Inherent Risk', description: 'Assessment of the key project and credit risks and their likelihood.' },
  { id: 'key_success', name: 'Key Success Factors', description: 'The critical factors the project depends on to succeed (formerly Critical Success Factors).' },
  { id: 'others', name: 'Others', description: 'Any additional supporting documents relevant to the application.', multiple: true },
]

const FACILITY_TYPES: FacilityType[] = [
  {
    id: 'ft_shs',
    name: 'Solar Home System',
    tooltip:
      'For solar vendors to scale deployment through aggregated demand, offering lease-to-own or pay-as-you-go options while the Bank funds the vendors.',
    documentSections: common([
      { id: 'afs', name: 'Audited financial statements', description: 'Minimum 3 years where available.' },
      { id: 'bplan', name: 'Business plan', description: 'Including the pipeline of customers.' },
      { id: 'uop', name: 'Use-of-proceeds breakdown', description: 'How the requested facility will be deployed.' },
      { id: 'vendor_quote', name: 'Vendor quotation / system specifications', description: 'Equipment quotations and technical system specifications.' },
      { id: 'distribution', name: 'Distribution network & operational capacity', description: 'Evidence of distribution reach and operational capability.' },
    ]),
  },
  {
    id: 'ft_ci',
    name: 'Commercial and Industrial Projects',
    tooltip:
      'A structured financing solution for renewable-energy transition for commercial and industrial companies.',
    documentSections: common([
      { id: 'afs', name: 'Audited financial statements', description: '2–3 years of audited accounts.' },
      { id: 'mgmt_accounts', name: 'Management accounts', description: 'Where applicable.' },
      { id: 'energy_audit', name: 'Energy audit report / load assessment', description: 'Assessment of energy load and consumption profile.' },
      { id: 'tech_design', name: 'Technical system design & specifications', description: 'Engineering design and equipment specifications.' },
      { id: 'epc', name: 'EPC contract / developer agreement', description: 'Engineering, procurement & construction or developer agreement.' },
      { id: 'governance', name: 'Corporate governance structure', description: 'Board and management governance framework.' },
    ]),
  },
  {
    id: 'ft_isolated',
    name: 'Isolated Mini Grid Projects',
    tooltip: 'For rural electrification with repayments tied to project cashflows.',
    documentSections: common([
      { id: 'feasibility', name: 'Feasibility study and business plan', description: 'Technical and commercial feasibility with a business plan.' },
      { id: 'load_demand', name: 'Load assessment and demand analysis', description: 'Community load profile and demand analysis.' },
      { id: 'community_agreements', name: 'Community engagement agreements', description: 'Exclusivity agreement, PPA, and Deed of Assignment.' },
      { id: 'tariff', name: 'Tariff model and regulatory approvals', description: 'Where applicable.' },
      { id: 'track_record', name: 'Developer track record & CVs', description: 'Track record and CVs of the management team, or documents evidencing these.' },
      { id: 'tech_design', name: 'Technical design and system specifications', description: 'System design and technical specifications.' },
      { id: 'grant', name: 'Grant status / REA grant approval', description: 'Grant application status or evidence of REA grant approval.' },
      { id: 'fin_model', name: 'Financial model demonstrating viability', description: 'Project financial model demonstrating viability.' },
    ]),
  },
  {
    id: 'ft_interconnected',
    name: 'Interconnected Mini Grid Projects',
    tooltip:
      'For interconnected mini-grids that enhance grid reliability using distributed renewable energy integrated with existing DISCO infrastructure and billing systems.',
    documentSections: common([
      { id: 'feasibility', name: 'Feasibility study and project business plan', description: 'Feasibility study with a project business plan.' },
      { id: 'load_network', name: 'Load assessment and network analysis', description: 'Load profile and network integration analysis.' },
      { id: 'disco', name: 'Interconnection agreement with DISCO', description: 'Executed interconnection agreement with the DISCO.' },
      { id: 'ppa', name: 'Power Purchase Agreement / service agreement', description: 'PPA or equivalent service agreement.' },
      { id: 'tariff', name: 'Tariff structure and regulatory approvals', description: 'Approved tariff structure and regulatory approvals.' },
      { id: 'track_record', name: 'Developer track record & technical capability', description: 'Evidence of developer track record and technical capability.' },
      { id: 'tech_design', name: 'Technical design and integration plan', description: 'Technical design with a grid-integration plan.' },
      { id: 'fin_model', name: 'Financial model demonstrating viability', description: 'Project financial model demonstrating viability.' },
    ]),
  },
]

/* ------------------------------- sectors ---------------------------------- */

export const SECTORS: Sector[] = [
  {
    id: 'sec_renewable',
    name: 'Renewable Energy',
    status: 'active',
    facilityTypes: FACILITY_TYPES,
    detailFields: [],
    additionalFields: [
      { id: 'af_esg', name: 'ESG considerations', section: 'Additional Requirement', description: 'Environmental, social and governance considerations for the project.', type: 'text' },
    ],
  },
  {
    id: 'sec_agric',
    name: 'Agriculture',
    status: 'active',
    facilityTypes: [
      {
        id: 'ft_agro',
        name: 'Agro-processing Facility',
        tooltip: 'Financing for agro-processing plants and value-addition equipment.',
        documentSections: common([
          { id: 'afs', name: 'Audited financial statements', description: '2–3 years of audited accounts.' },
          { id: 'offtake', name: 'Offtake agreements', description: 'Executed or draft offtake agreements.' },
        ]),
      },
    ],
    detailFields: [],
    additionalFields: [],
  },
  { id: 'sec_health', name: 'Health', status: 'active', facilityTypes: [], detailFields: [], additionalFields: [] },
  { id: 'sec_transport', name: 'Transport', status: 'draft', facilityTypes: [], detailFields: [], additionalFields: [] },
  { id: 'sec_education', name: 'Education', status: 'inactive', facilityTypes: [], detailFields: [], additionalFields: [] },
]


/* ------------------------------- projects --------------------------------- */

function fileRef(name: string, section: string): FileRef {
  return { id: `f_${section}_${name.length}`, name, section, sizeKb: 320 + name.length * 7, at: '2026-05-12' }
}
function docSet(ftId: string, fill: string[]): Record<string, FileRef[]> {
  const ft = FACILITY_TYPES.find((f) => f.id === ftId)!
  const out: Record<string, FileRef[]> = {}
  for (const s of ft.documentSections) {
    if (fill.includes(s.id)) out[s.id] = [fileRef(`${s.name}.pdf`, s.id)]
  }
  return out
}

export const PROJECTS: Project[] = [
  {
    id: 'prj_1', ref: 'SFMP-PRJ-0001', borrower: BORROWER_CO, sectorId: 'sec_renewable', facilityTypeId: 'ft_shs',
    name: 'Northern Grid Solar Home Rollout', description: 'Deploy 12,000 pay-as-you-go solar home systems across off-grid communities in Kano and Katsina, funded via aggregated vendor demand.',
    purpose: 'Working capital to import and deploy solar home systems on a lease-to-own basis.',
    amount: 850_000_000, tenor: 48, moratorium: '6 months', domiciliation: 'All PAYG receipts domiciled with Sterling Bank', equity: 25, sourceOfRepayment: 'Monthly customer PAYG collections and lease receipts',
    risks: [{ id: 'r1', risk: 'Foreign-exchange volatility on imported panels', consequences: 'Higher landed cost erodes margin', mitigants: 'Forward FX cover and staged procurement' }],
    documents: docSet('ft_shs', ['moa', 'cac', 'afs', 'bplan', 'uop', 'vendor_quote']), fieldValues: {}, additional: 'Vendor has a 3-year operating track record in the North-West.',
    infoRequests: [
      { id: 'ir_1', by: ADMIN_CO, question: 'Provide the updated use-of-proceeds breakdown and the latest customer pipeline.', at: '2026-06-30T09:20:00Z' },
    ],
    status: 'on_marketplace', createdAt: '2026-05-10', updatedAt: '2026-06-30',
  },
  {
    id: 'prj_2', ref: 'SFMP-PRJ-0002', borrower: BORROWER_CO, sectorId: 'sec_renewable', facilityTypeId: 'ft_ci',
    name: 'Aba Industrial Cluster Solar Transition', description: 'A 4.5 MWp rooftop and ground-mount solar plant to displace diesel for a cluster of manufacturers in Aba.',
    purpose: 'Capital expenditure for a captive C&I solar installation.', amount: 1_200_000_000, tenor: 60, moratorium: '9 months', domiciliation: 'Energy service payments domiciled with Sterling Bank', equity: 30, sourceOfRepayment: 'Fixed monthly energy-service payments from offtakers',
    risks: [{ id: 'r1', risk: 'Offtaker payment default', consequences: 'Cashflow shortfall', mitigants: 'Bank guarantees and security deposits from offtakers' }],
    documents: docSet('ft_ci', ['moa', 'cac', 'afs', 'energy_audit', 'tech_design', 'epc']), fieldValues: {}, additional: 'EPC contractor is Tier-1 with 40+ C&I installations.',
    infoRequests: [
      { id: 'ir_2', by: FINANCIER_CO, question: 'Share the offtaker credit assessments for the top five manufacturers.', answer: 'Uploaded under Credibility — all five carry investment-grade internal ratings from their lead banks.', at: '2026-05-20T11:00:00Z' },
    ],
    status: 'recommended', recommendedBy: ADMIN_CO, createdAt: '2026-04-28', updatedAt: '2026-05-25',
  },
  {
    id: 'prj_3', ref: 'SFMP-PRJ-0003', borrower: 'Savannah Power Co', sectorId: 'sec_renewable', facilityTypeId: 'ft_isolated',
    name: 'Bakin Ruwa Isolated Mini-Grid', description: 'A 320 kW isolated mini-grid electrifying 1,800 connections in a farming community with productive-use anchor loads.',
    purpose: 'Project finance for an isolated mini-grid with REA grant support.', amount: 640_000_000, tenor: 72, moratorium: '12 months', domiciliation: 'Tariff collections domiciled with Sterling Bank', equity: 22, sourceOfRepayment: 'Community tariff collections and productive-use revenue',
    risks: [{ id: 'r1', risk: 'Lower-than-forecast demand', consequences: 'Revenue below projections', mitigants: 'Anchor-business load and demand-stimulation programme' }],
    documents: docSet('ft_isolated', ['moa', 'cac', 'feasibility', 'load_demand', 'community_agreements', 'grant', 'fin_model']), fieldValues: {}, additional: 'REA grant approval letter attached.',
    status: 'selected', financier: FINANCIER_CO, recommendedBy: ADMIN_CO, createdAt: '2026-04-15', updatedAt: '2026-05-12',
  },
  {
    id: 'prj_4', ref: 'SFMP-PRJ-0004', borrower: 'Delta Renewables Ltd', sectorId: 'sec_renewable', facilityTypeId: 'ft_interconnected',
    name: 'Asaba Interconnected Mini-Grid', description: 'A 1.1 MW interconnected mini-grid improving reliability under a DISCO franchise with distributed solar + storage.',
    purpose: 'Finance for an interconnected mini-grid integrated with the DISCO.', amount: 980_000_000, tenor: 84, moratorium: '12 months', domiciliation: 'Billing settlements domiciled with Sterling Bank', equity: 28, sourceOfRepayment: 'DISCO billing settlements and service payments',
    risks: [{ id: 'r1', risk: 'DISCO settlement delays', consequences: 'Working-capital strain', mitigants: 'Escrow and settlement guarantees' }],
    documents: docSet('ft_interconnected', ['moa', 'cac', 'feasibility', 'load_network', 'disco', 'ppa', 'tariff', 'fin_model']), fieldValues: {}, additional: 'Executed interconnection agreement with the DISCO in place.',
    checklist: [
      { id: 'c1', label: 'Facility agreement executed', checked: true },
      { id: 'c2', label: 'Security perfected', checked: false },
      { id: 'c3', label: 'Conditions precedent met', checked: false },
      { id: 'c4', label: 'Disbursement account set up', checked: false },
    ],
    status: 'accepted', financier: FINANCIER_CO, recommendedBy: ADMIN_CO, createdAt: '2026-03-20', updatedAt: '2026-05-09',
  },
  {
    id: 'prj_5', ref: 'SFMP-PRJ-0005', borrower: 'Sahel Solar Ltd', sectorId: 'sec_renewable', facilityTypeId: 'ft_shs',
    name: 'Sahel PAYG Solar Expansion', description: 'Expansion of a PAYG solar portfolio into three additional states.',
    purpose: 'Working capital for portfolio expansion.', amount: 420_000_000, tenor: 36, moratorium: '3 months', domiciliation: 'Collections domiciled with Sterling Bank', equity: 20, sourceOfRepayment: 'PAYG collections',
    risks: [], documents: docSet('ft_shs', ['moa', 'cac']), fieldValues: {}, additional: '',
    status: 'rejected', recommendedBy: ADMIN_CO,
    rejections: [
      { by: 'Anchorline Investments', reason: 'Collection performance data was inconclusive for the newest state.', at: '2026-04-18' },
      { by: FINANCIER_CO, reason: 'Insufficient audited financials and thin equity contribution for the requested tenor.', at: '2026-05-02' },
    ],
    createdAt: '2026-04-02', updatedAt: '2026-05-02',
  },
  {
    id: 'prj_draft', ref: 'SFMP-PRJ-0006', borrower: BORROWER_CO, sectorId: 'sec_renewable', facilityTypeId: 'ft_shs',
    name: 'Plateau Solar Micro-lease Pilot', description: 'A pilot micro-lease programme for solar home systems in Plateau State.',
    purpose: 'Pilot working capital.', amount: 120_000_000, tenor: 24, moratorium: '', domiciliation: '', equity: 0, sourceOfRepayment: '',
    risks: [], documents: docSet('ft_shs', ['moa']), fieldValues: {}, additional: '',
    status: 'in_progress', createdAt: '2026-06-28', updatedAt: '2026-07-01',
  },
  {
    id: 'prj_6', ref: 'SFMP-PRJ-0007', borrower: BORROWER_CO, sectorId: 'sec_renewable', facilityTypeId: 'ft_isolated',
    name: 'Oyo Rural Electrification Cluster', description: 'Three isolated mini-grids (110–180 kW) serving farming clusters around Saki with shared O&M.',
    purpose: 'Project finance for a three-site mini-grid cluster.', amount: 730_000_000, tenor: 72, moratorium: '9 months', domiciliation: 'Tariff collections domiciled with Sterling Bank', equity: 24, sourceOfRepayment: 'Pooled tariff collections across the three sites',
    risks: [{ id: 'r1', risk: 'Single-site underperformance', consequences: 'Pooled cashflow dilution', mitigants: 'Cross-collateralised sites and shared O&M contract' }],
    documents: docSet('ft_isolated', ['moa', 'cac', 'feasibility', 'load_demand', 'tariff', 'fin_model']), fieldValues: {}, additional: '',
    status: 'selected', financier: 'Anchorline Investments', recommendedBy: ADMIN_CO, createdAt: '2026-05-18', updatedAt: '2026-06-21',
  },
  {
    id: 'prj_7', ref: 'SFMP-PRJ-0008', borrower: BORROWER_CO, sectorId: 'sec_renewable', facilityTypeId: 'ft_interconnected',
    name: 'Ibadan North Feeder Upgrade', description: 'A 900 kW interconnected mini-grid stabilising a DISCO feeder serving light industry in Ibadan North.',
    purpose: 'Finance for an interconnected mini-grid with storage.', amount: 890_000_000, tenor: 78, moratorium: '10 months', domiciliation: 'Billing settlements domiciled with Sterling Bank', equity: 26, sourceOfRepayment: 'DISCO settlements and industrial service fees',
    risks: [{ id: 'r1', risk: 'Feeder load migration', consequences: 'Lower settlement volume', mitigants: 'Minimum-offtake clause in the DISCO agreement' }],
    documents: docSet('ft_interconnected', ['moa', 'cac', 'feasibility', 'load_network', 'disco', 'ppa', 'tariff', 'track_record', 'fin_model']), fieldValues: {}, additional: '',
    checklist: [
      { id: 'c1', label: 'Facility agreement executed', checked: true },
      { id: 'c2', label: 'Security perfected', checked: true },
      { id: 'c3', label: 'Conditions precedent met', checked: true },
      { id: 'c4', label: 'Disbursement account set up', checked: true },
    ],
    repayment: { frequency: 'quarterly', firstDate: '2026-10-01', amount: 41_500_000, account: '0087245513' },
    status: 'accepted', financier: 'Anchorline Investments', recommendedBy: ADMIN_CO, createdAt: '2026-03-02', updatedAt: '2026-06-14',
  },
  {
    id: 'prj_8', ref: 'SFMP-PRJ-0009', borrower: 'GreenVolt Microgrids', sectorId: 'sec_renewable', facilityTypeId: 'ft_shs',
    name: 'Benue Solar Home Fleet', description: 'Aggregated demand programme placing 6,500 solar home systems with smallholder cooperatives in Benue.',
    purpose: 'Working capital for system imports and deployment.', amount: 510_000_000, tenor: 42, moratorium: '6 months', domiciliation: 'PAYG receipts domiciled with Sterling Bank', equity: 21, sourceOfRepayment: 'Cooperative-collected PAYG receipts',
    risks: [{ id: 'r1', risk: 'Cooperative collection lapses', consequences: 'Receipt shortfalls', mitigants: 'Cooperative-level reserves and remote lockout' }],
    documents: docSet('ft_shs', ['moa', 'cac', 'afs', 'bplan', 'distribution']), fieldValues: {}, additional: '',
    status: 'on_marketplace', createdAt: '2026-06-20', updatedAt: '2026-06-26',
  },
  {
    id: 'prj_9', ref: 'SFMP-PRJ-0010', borrower: 'Savannah Power Co', sectorId: 'sec_renewable', facilityTypeId: 'ft_ci',
    name: 'Kaduna Textile Mill Solar Retrofit', description: 'A 2.2 MWp captive solar retrofit for a textile mill displacing 60% of diesel generation.',
    purpose: 'Capex for a captive C&I retrofit.', amount: 640_000_000, tenor: 54, moratorium: '6 months', domiciliation: 'Energy service payments domiciled with Sterling Bank', equity: 27, sourceOfRepayment: 'Monthly energy-service payments',
    risks: [], documents: docSet('ft_ci', ['moa', 'cac', 'afs', 'energy_audit', 'tech_design']), fieldValues: {}, additional: '',
    status: 'recommended', recommendedBy: ADMIN_CO, createdAt: '2026-06-05', updatedAt: '2026-06-24',
  },
  {
    id: 'prj_10', ref: 'SFMP-PRJ-0011', borrower: 'Kano AgroEnergy', sectorId: 'sec_agric', facilityTypeId: 'ft_agro',
    name: 'Kano Rice Mill Expansion', description: 'Capacity expansion of a parboiled rice mill with solar-assisted drying.',
    purpose: 'Equipment finance for milling and drying lines.', amount: 380_000_000, tenor: 48, moratorium: '6 months', domiciliation: 'Offtake proceeds domiciled with Sterling Bank', equity: 30, sourceOfRepayment: 'Offtake contracts with two aggregators',
    risks: [{ id: 'r1', risk: 'Paddy supply seasonality', consequences: 'Utilisation dips', mitigants: 'Warehouse receipts and forward paddy contracts' }],
    documents: { moa: [fileRef('Memorandum & Articles of Association.pdf', 'moa')], cac: [fileRef('CAC status report.pdf', 'cac')], offtake: [fileRef('Offtake agreements.pdf', 'offtake')] },
    fieldValues: {}, additional: '',
    status: 'on_marketplace', createdAt: '2026-06-27', updatedAt: '2026-07-01',
  },
  {
    id: 'prj_11', ref: 'SFMP-PRJ-0012', borrower: BORROWER_CO, sectorId: 'sec_renewable', facilityTypeId: 'ft_shs',
    name: 'Kebbi Solar Home Expansion', description: 'Deploy 4,800 pay-as-you-go solar home systems across river-basin communities in Kebbi State.',
    purpose: 'Working capital for system imports and last-mile deployment.', amount: 460_000_000, tenor: 36, moratorium: '4 months', domiciliation: 'PAYG receipts domiciled with Sterling Bank', equity: 22, sourceOfRepayment: 'Monthly PAYG collections',
    risks: [{ id: 'r1', risk: 'Seasonal income volatility among customers', consequences: 'Collection dips in planting season', mitigants: 'Flexible harvest-aligned payment plans' }],
    documents: docSet('ft_shs', ['moa', 'cac', 'afs', 'bplan', 'uop']), fieldValues: {}, additional: '',
    status: 'on_marketplace', createdAt: '2026-06-15', updatedAt: '2026-06-29',
  },
  {
    id: 'prj_12', ref: 'SFMP-PRJ-0013', borrower: BORROWER_CO, sectorId: 'sec_renewable', facilityTypeId: 'ft_ci',
    name: 'Ogun Agro-Processing Solar Plant', description: 'A 1.8 MWp captive solar plant for an agro-processing park in Ogun State displacing grid and diesel supply.',
    purpose: 'Capex for a captive C&I solar installation with storage.', amount: 780_000_000, tenor: 60, moratorium: '8 months', domiciliation: 'Energy service payments domiciled with Sterling Bank', equity: 25, sourceOfRepayment: 'Fixed monthly energy-service payments',
    risks: [{ id: 'r1', risk: 'Park occupancy below forecast', consequences: 'Lower energy offtake', mitigants: 'Anchor tenant covers 60% of load' }],
    documents: docSet('ft_ci', ['moa', 'cac', 'afs', 'energy_audit', 'tech_design', 'epc']), fieldValues: {}, additional: '',
    status: 'recommended', recommendedBy: ADMIN_CO, createdAt: '2026-05-30', updatedAt: '2026-06-22',
  },
  {
    id: 'prj_13', ref: 'SFMP-PRJ-0014', borrower: BORROWER_CO, sectorId: 'sec_renewable', facilityTypeId: 'ft_isolated',
    name: 'Taraba Highlands Mini-Grid', description: 'A 260 kW isolated mini-grid electrifying tea-farming communities on the Mambilla plateau.',
    purpose: 'Project finance for an isolated mini-grid with agro anchor loads.', amount: 560_000_000, tenor: 72, moratorium: '12 months', domiciliation: 'Tariff collections domiciled with Sterling Bank', equity: 23, sourceOfRepayment: 'Community tariff and tea-factory service revenue',
    risks: [{ id: 'r1', risk: 'Difficult terrain raises O&M cost', consequences: 'Margin pressure', mitigants: 'Local technician programme and spares depot on site' }],
    documents: docSet('ft_isolated', ['moa', 'cac', 'feasibility', 'load_demand', 'fin_model']), fieldValues: {}, additional: '',
    status: 'on_marketplace', createdAt: '2026-06-18', updatedAt: '2026-06-30',
  },
  {
    id: 'prj_14', ref: 'SFMP-PRJ-0015', borrower: BORROWER_CO, sectorId: 'sec_renewable', facilityTypeId: 'ft_ci',
    name: 'Lagos Cold-Chain Solar Retrofit', description: 'A 3.1 MWp solar-plus-storage retrofit for a cold-chain logistics operator across three Lagos depots.',
    purpose: 'Capex for solar and battery storage across three depots.', amount: 910_000_000, tenor: 66, moratorium: '9 months', domiciliation: 'Energy service payments domiciled with Sterling Bank', equity: 28, sourceOfRepayment: 'Monthly energy-service payments from the operator',
    risks: [{ id: 'r1', risk: 'Battery degradation faster than warranted', consequences: 'Higher replacement capex', mitigants: 'Tier-1 OEM warranty with performance guarantees' }],
    documents: docSet('ft_ci', ['moa', 'cac', 'afs', 'mgmt_accounts', 'energy_audit', 'tech_design', 'epc']), fieldValues: {}, additional: '',
    status: 'selected', financier: FINANCIER_CO, recommendedBy: ADMIN_CO, createdAt: '2026-05-06', updatedAt: '2026-06-19',
  },
  {
    id: 'prj_15', ref: 'SFMP-PRJ-0016', borrower: BORROWER_CO, sectorId: 'sec_renewable', facilityTypeId: 'ft_shs',
    name: 'Niger State PAYG Pilot', description: 'A 1,200-unit PAYG solar home pilot around Bida with a new rural agent network.',
    purpose: 'Pilot working capital for systems and agent onboarding.', amount: 280_000_000, tenor: 30, moratorium: '3 months', domiciliation: 'Collections domiciled with Sterling Bank', equity: 20, sourceOfRepayment: 'PAYG collections',
    risks: [], documents: docSet('ft_shs', ['moa', 'cac', 'bplan']), fieldValues: {}, additional: '',
    status: 'rejected', recommendedBy: ADMIN_CO,
    rejections: [
      { by: 'Ivory Trust Capital', reason: 'Agent network is unproven in the pilot corridor.', at: '2026-05-22' },
    ],
    createdAt: '2026-04-25', updatedAt: '2026-05-22',
  },
  {
    id: 'prj_16', ref: 'SFMP-PRJ-0017', borrower: BORROWER_CO, sectorId: 'sec_renewable', facilityTypeId: 'ft_interconnected',
    name: 'Abeokuta Feeder Stabilisation', description: 'A 1.4 MW interconnected mini-grid stabilising two DISCO feeders serving Abeokuta light industry.',
    purpose: 'Finance for an interconnected mini-grid with storage.', amount: 1_050_000_000, tenor: 84, moratorium: '12 months', domiciliation: 'Billing settlements domiciled with Sterling Bank', equity: 27, sourceOfRepayment: 'DISCO billing settlements',
    risks: [{ id: 'r1', risk: 'Regulatory tariff review', consequences: 'Settlement margin compression', mitigants: 'Pass-through clauses in the franchise agreement' }],
    documents: docSet('ft_interconnected', ['moa', 'cac', 'feasibility', 'load_network', 'disco', 'ppa', 'tariff', 'fin_model']), fieldValues: {}, additional: '',
    checklist: [
      { id: 'c1', label: 'Facility agreement executed', checked: true },
      { id: 'c2', label: 'Security perfected', checked: true },
      { id: 'c3', label: 'Conditions precedent met', checked: false },
      { id: 'c4', label: 'Disbursement account set up', checked: false },
    ],
    status: 'accepted', financier: FINANCIER_CO, recommendedBy: ADMIN_CO, createdAt: '2026-02-14', updatedAt: '2026-06-08',
  },
  {
    id: 'prj_17', ref: 'SFMP-PRJ-0018', borrower: 'Enugu SolarWorks', sectorId: 'sec_renewable', facilityTypeId: 'ft_ci',
    name: 'Nnewi Auto-Parts Cluster Solar', description: 'A 2.6 MWp shared solar plant for an auto-parts manufacturing cluster in Nnewi.',
    purpose: 'Capex for a shared C&I installation across the cluster.', amount: 670_000_000, tenor: 60, moratorium: '6 months', domiciliation: 'Energy service payments domiciled with Sterling Bank', equity: 24, sourceOfRepayment: 'Pooled energy-service payments from cluster members',
    risks: [{ id: 'r1', risk: 'Member churn within the cluster', consequences: 'Offtake shortfall', mitigants: 'Take-or-pay commitments from the cluster association' }],
    documents: docSet('ft_ci', ['moa', 'cac', 'afs', 'energy_audit', 'tech_design', 'governance']), fieldValues: {}, additional: '',
    status: 'recommended', recommendedBy: ADMIN_CO, createdAt: '2026-05-25', updatedAt: '2026-06-09',
  },
  {
    id: 'prj_18', ref: 'SFMP-PRJ-0019', borrower: 'Rivers CleanGen', sectorId: 'sec_renewable', facilityTypeId: 'ft_isolated',
    name: 'Bonny Island Mini-Grid', description: 'A 480 kW isolated mini-grid with marine logistics serving fishing settlements on Bonny Island.',
    purpose: 'Project finance for an island mini-grid.', amount: 850_000_000, tenor: 78, moratorium: '12 months', domiciliation: 'Tariff collections domiciled with Sterling Bank', equity: 26, sourceOfRepayment: 'Community tariffs and cold-storage service fees',
    risks: [{ id: 'r1', risk: 'Marine logistics disruptions', consequences: 'O&M delays', mitigants: 'On-island spares inventory and trained local operators' }],
    documents: docSet('ft_isolated', ['moa', 'cac', 'feasibility', 'load_demand', 'community_agreements', 'fin_model']), fieldValues: {}, additional: '',
    status: 'recommended', recommendedBy: ADMIN_CO, createdAt: '2026-05-12', updatedAt: '2026-05-31',
  },
  {
    id: 'prj_19', ref: 'SFMP-PRJ-0020', borrower: 'Oshogbo AgroMills', sectorId: 'sec_agric', facilityTypeId: 'ft_agro',
    name: 'Osun Cassava Processing Line', description: 'A high-quality cassava flour processing line with solar-assisted drying in Osogbo.',
    purpose: 'Equipment finance for processing and drying lines.', amount: 340_000_000, tenor: 48, moratorium: '6 months', domiciliation: 'Offtake proceeds domiciled with Sterling Bank', equity: 30, sourceOfRepayment: 'Offtake contracts with two food manufacturers',
    risks: [{ id: 'r1', risk: 'Cassava supply seasonality', consequences: 'Utilisation dips', mitigants: 'Outgrower scheme with forward contracts' }],
    documents: { moa: [fileRef('Memorandum & Articles of Association.pdf', 'moa')], cac: [fileRef('CAC status report.pdf', 'cac')], offtake: [fileRef('Offtake agreements.pdf', 'offtake')] },
    fieldValues: {}, additional: '',
    status: 'on_marketplace', createdAt: '2026-06-24', updatedAt: '2026-06-30',
  },
  {
    id: 'prj_20', ref: 'SFMP-PRJ-0021', borrower: 'Katsina AgriSolar', sectorId: 'sec_renewable', facilityTypeId: 'ft_shs',
    name: 'Katsina Solar Irrigation Fleet', description: 'Solar water-pumping kits for 2,400 smallholder irrigation plots, financed on lease-to-own.',
    purpose: 'Working capital for pump imports and deployment.', amount: 520_000_000, tenor: 42, moratorium: '5 months', domiciliation: 'Lease receipts domiciled with Sterling Bank', equity: 21, sourceOfRepayment: 'Lease-to-own receipts from farmer cooperatives',
    risks: [{ id: 'r1', risk: 'Groundwater variability', consequences: 'Pump utilisation drops', mitigants: 'Hydrogeological survey before each cluster rollout' }],
    documents: docSet('ft_shs', ['moa', 'cac', 'afs', 'bplan', 'distribution']), fieldValues: {}, additional: '',
    status: 'recommended', recommendedBy: ADMIN_CO, createdAt: '2026-05-20', updatedAt: '2026-06-12',
  },
  {
    id: 'prj_21', ref: 'SFMP-PRJ-0022', borrower: 'Savannah Power Co', sectorId: 'sec_renewable', facilityTypeId: 'ft_isolated',
    name: 'Zamfara Rural Grid Phase II', description: 'Second-phase expansion adding two 150 kW mini-grids to an operating rural portfolio.',
    purpose: 'Expansion finance for two additional mini-grid sites.', amount: 720_000_000, tenor: 72, moratorium: '10 months', domiciliation: 'Tariff collections domiciled with Sterling Bank', equity: 25, sourceOfRepayment: 'Pooled tariff collections across the portfolio',
    risks: [{ id: 'r1', risk: 'Security-related site access constraints', consequences: 'Construction delays', mitigants: 'Community security compacts and phased mobilisation' }],
    documents: docSet('ft_isolated', ['moa', 'cac', 'feasibility', 'load_demand', 'track_record', 'fin_model']), fieldValues: {}, additional: '',
    status: 'selected', financier: 'Anchorline Investments', recommendedBy: ADMIN_CO, createdAt: '2026-04-20', updatedAt: '2026-06-16',
  },
  {
    id: 'prj_22', ref: 'SFMP-PRJ-0023', borrower: 'Delta Renewables Ltd', sectorId: 'sec_renewable', facilityTypeId: 'ft_ci',
    name: 'Warri Port Logistics Solar', description: 'A 3.8 MWp solar-plus-storage installation for a port logistics operator in Warri.',
    purpose: 'Capex for a captive port-side C&I installation.', amount: 1_300_000_000, tenor: 72, moratorium: '9 months', domiciliation: 'Energy service payments domiciled with Sterling Bank', equity: 29, sourceOfRepayment: 'Monthly energy-service payments from the operator',
    risks: [{ id: 'r1', risk: 'Port traffic downturn', consequences: 'Operator payment stress', mitigants: 'Parent-company guarantee and reserve account' }],
    documents: docSet('ft_ci', ['moa', 'cac', 'afs', 'energy_audit', 'tech_design', 'epc', 'governance']), fieldValues: {}, additional: '',
    checklist: [
      { id: 'c1', label: 'Facility agreement executed', checked: true },
      { id: 'c2', label: 'Security perfected', checked: true },
      { id: 'c3', label: 'Conditions precedent met', checked: true },
      { id: 'c4', label: 'Disbursement account set up', checked: false },
    ],
    status: 'accepted', financier: FINANCIER_CO, recommendedBy: ADMIN_CO, createdAt: '2026-03-10', updatedAt: '2026-06-05',
  },
  {
    id: 'prj_23', ref: 'SFMP-PRJ-0024', borrower: 'GreenVolt Microgrids', sectorId: 'sec_renewable', facilityTypeId: 'ft_isolated',
    name: 'Gboko Agro-Cluster Mini-Grid', description: 'A 210 kW isolated mini-grid anchored on rice and soybean processing loads around Gboko.',
    purpose: 'Project finance for an agro-anchored mini-grid.', amount: 610_000_000, tenor: 66, moratorium: '9 months', domiciliation: 'Tariff collections domiciled with Sterling Bank', equity: 23, sourceOfRepayment: 'Anchor-processor service fees and community tariffs',
    risks: [{ id: 'r1', risk: 'Anchor processor downtime', consequences: 'Revenue concentration risk', mitigants: 'Two independent anchor loads and community demand growth' }],
    documents: docSet('ft_isolated', ['moa', 'cac', 'feasibility', 'load_demand', 'community_agreements', 'grant', 'fin_model']), fieldValues: {}, additional: '',
    status: 'recommended', recommendedBy: ADMIN_CO, createdAt: '2026-06-02', updatedAt: '2026-06-20',
  },
  {
    id: 'prj_24', ref: 'SFMP-PRJ-0025', borrower: 'Calabar HydroPower', sectorId: 'sec_renewable', facilityTypeId: 'ft_interconnected',
    name: 'Calabar Municipal Feeder', description: 'A 1.0 MW interconnected mini-grid improving supply on a municipal feeder in Calabar.',
    purpose: 'Finance for an interconnected mini-grid under a DISCO franchise.', amount: 940_000_000, tenor: 80, moratorium: '12 months', domiciliation: 'Billing settlements domiciled with Sterling Bank', equity: 26, sourceOfRepayment: 'DISCO billing settlements',
    risks: [{ id: 'r1', risk: 'Franchise renegotiation', consequences: 'Term uncertainty', mitigants: 'Ten-year franchise with arbitration clauses' }],
    documents: docSet('ft_interconnected', ['moa', 'cac', 'feasibility', 'load_network', 'disco', 'ppa']), fieldValues: {}, additional: '',
    status: 'on_marketplace', createdAt: '2026-06-26', updatedAt: '2026-07-01',
  },
  {
    id: 'prj_25', ref: 'SFMP-PRJ-0026', borrower: 'Kano AgroEnergy', sectorId: 'sec_agric', facilityTypeId: 'ft_agro',
    name: 'Kano Groundnut Oil Mill', description: 'A groundnut crushing and refining line with waste-to-heat recovery in Kano.',
    purpose: 'Equipment finance for crushing and refining lines.', amount: 450_000_000, tenor: 54, moratorium: '6 months', domiciliation: 'Offtake proceeds domiciled with Sterling Bank', equity: 28, sourceOfRepayment: 'Offtake contracts with edible-oil distributors',
    risks: [{ id: 'r1', risk: 'Groundnut price volatility', consequences: 'Margin swings', mitigants: 'Forward purchase contracts with aggregators' }],
    documents: { moa: [fileRef('Memorandum & Articles of Association.pdf', 'moa')], cac: [fileRef('CAC status report.pdf', 'cac')], offtake: [fileRef('Offtake agreements.pdf', 'offtake')] },
    fieldValues: {}, additional: '',
    checklist: [
      { id: 'c1', label: 'Facility agreement executed', checked: true },
      { id: 'c2', label: 'Security perfected', checked: true },
      { id: 'c3', label: 'Conditions precedent met', checked: true },
      { id: 'c4', label: 'Disbursement account set up', checked: true },
    ],
    repayment: { frequency: 'quarterly', firstDate: '2026-11-01', amount: 24_800_000, account: '0091338822' },
    status: 'accepted', financier: FINANCIER_CO, recommendedBy: ADMIN_CO, createdAt: '2026-02-28', updatedAt: '2026-05-28',
  },
]

/* -------------------------- borrower / financier -------------------------- */

/** Complete onboarding document packs — the wizard requires all of these
 *  before an institution can submit, so every profile carries them. */
function obDocs(prefix: string): FileRef[] {
  return [
    { id: `${prefix}_doc1`, name: 'Business analysis.pdf', section: 'Business analysis', sizeKb: 812, at: '2026-04-10' },
    { id: `${prefix}_doc2`, name: 'Certificate of incorporation.pdf', section: 'Certificate of incorporation', sizeKb: 402, at: '2026-04-10' },
    { id: `${prefix}_doc3`, name: 'Memorandum & Articles.pdf', section: 'Memorandum & Articles', sizeKb: 655, at: '2026-04-10' },
    { id: `${prefix}_doc4`, name: 'Proof of address.pdf', section: 'Proof of address', sizeKb: 238, at: '2026-04-10' },
  ]
}
function finDocs(prefix: string): FileRef[] {
  return [
    { id: `${prefix}_doc1`, name: 'Certificate of incorporation.pdf', section: 'Certificate of incorporation', sizeKb: 415, at: '2026-03-01' },
    { id: `${prefix}_doc2`, name: 'Investment policy.pdf', section: 'Investment policy', sizeKb: 540, at: '2026-03-01' },
    { id: `${prefix}_doc3`, name: 'Regulatory license.pdf', section: 'Regulatory license', sizeKb: 366, at: '2026-03-01' },
    { id: `${prefix}_doc4`, name: 'Proof of address.pdf', section: 'Proof of address', sizeKb: 224, at: '2026-03-01' },
  ]
}

export const BORROWERS: BorrowerProfile[] = [
  {
    company: BORROWER_CO, rcNumber: 'RC-1042882', tin: '20481123-0001', address: '14 Adeola Odeku Street, Victoria Island', state: 'Lagos',
    owners: [
      { id: 'o1', name: 'Amara Okonkwo', unitsHeld: 6000, percentHeld: 60, position: 'Managing Director', bvn: '22194883021', boardRep: true },
      { id: 'o2', name: 'Chidi Balogun', unitsHeld: 4000, percentHeld: 40, position: 'Executive Director', bvn: '22194883077', boardRep: true },
    ],
    directors: [
      { id: 'd1', name: 'Amara Okonkwo', dob: '1984-06-12', bvn: '22194883021', education: [{ school: 'University of Lagos', qualification: 'B.Eng Electrical', year: '2006' }], work: [{ place: 'Schneider Electric', position: 'Project Engineer' }], loanExposure: 'None', otherInvestments: 'AgriTech SPV (15%)' },
      { id: 'd2', name: 'Chidi Balogun', dob: '1981-11-03', bvn: '22194883077', education: [{ school: 'Ahmadu Bello University', qualification: 'B.Sc Accounting', year: '2003' }], work: [{ place: 'PwC Nigeria', position: 'Senior Associate' }], loanExposure: '\u20a645m mortgage (performing)', otherInvestments: 'None' },
    ],
    management: [
      { id: 'm1', name: 'Fatima Bello', education: [{ school: 'Covenant University', qualification: 'MBA Finance', year: '2014' }], work: [{ place: 'Access Bank', position: 'Relationship Manager' }] },
      { id: 'm2', name: 'Emeka Obi', education: [{ school: 'FUTO', qualification: 'B.Eng Mechanical', year: '2010' }], work: [{ place: 'Mikano', position: 'Service Manager' }] },
    ],
    documents: obDocs('hel'),
    onboarding: 'verified',
  },
  {
    company: 'Savannah Power Co', rcNumber: 'RC-9931002', tin: '30012288-0001', address: 'Plot 8 Ahmadu Bello Way, Kaduna', state: 'Kaduna',
    owners: [
      { id: 'o3', name: 'Suleiman Abubakar', unitsHeld: 7500, percentHeld: 75, position: 'Chief Executive', bvn: '22187904412', boardRep: true },
      { id: 'o4', name: 'Rekiya Abdullahi', unitsHeld: 2500, percentHeld: 25, position: 'Non-Executive Director', bvn: '22187904488', boardRep: false },
    ],
    directors: [
      { id: 'd3', name: 'Suleiman Abubakar', dob: '1978-02-19', bvn: '22187904412', education: [{ school: 'Bayero University Kano', qualification: 'B.Eng Electrical', year: '2001' }], work: [{ place: 'Kaduna Electric', position: 'Head of Networks' }], loanExposure: 'None', otherInvestments: 'Savannah Agro Ltd (20%)' },
    ],
    management: [
      { id: 'm3', name: 'Linda Danladi', education: [{ school: 'ABU Zaria', qualification: 'MBA', year: '2012' }], work: [{ place: 'Stanbic IBTC', position: 'Project Finance Analyst' }] },
    ],
    documents: obDocs('sav'),
    onboarding: 'verified',
  },
  {
    company: 'Delta Renewables Ltd', rcNumber: 'RC-7781200', tin: '41120933-0001', address: '3 Nnebisi Road, Asaba', state: 'Delta',
    owners: [
      { id: 'o5', name: 'Efe Oghenekaro', unitsHeld: 5500, percentHeld: 55, position: 'Managing Director', bvn: '22176623309', boardRep: true },
      { id: 'o6', name: 'Ngozi Okafor', unitsHeld: 4500, percentHeld: 45, position: 'Technical Director', bvn: '22176623355', boardRep: true },
    ],
    directors: [
      { id: 'd4', name: 'Efe Oghenekaro', dob: '1983-08-27', bvn: '22176623309', education: [{ school: 'University of Benin', qualification: 'B.Sc Physics', year: '2005' }], work: [{ place: 'Siemens Energy', position: 'Grid Engineer' }], loanExposure: 'None', otherInvestments: 'None' },
    ],
    management: [
      { id: 'm4', name: 'Osaro Igbinedion', education: [{ school: 'UNIBEN', qualification: 'B.Eng Electrical', year: '2009' }], work: [{ place: 'BEDC', position: 'Metering Lead' }] },
    ],
    documents: obDocs('del'),
    onboarding: 'verified',
  },
  {
    company: 'Sahel Solar Ltd', rcNumber: 'RC-5540991', tin: '55221100-0001', address: '22 Sultan Road, Sokoto', state: 'Sokoto',
    owners: [
      { id: 'o7', name: 'Aisha Bello', unitsHeld: 8000, percentHeld: 80, position: 'Chief Executive', bvn: '22169912207', boardRep: true },
      { id: 'o8', name: 'Umar Faruk', unitsHeld: 2000, percentHeld: 20, position: 'Operations Director', bvn: '22169912266', boardRep: false },
    ],
    directors: [
      { id: 'd5', name: 'Aisha Bello', dob: '1988-04-15', bvn: '22169912207', education: [{ school: 'Usmanu Danfodiyo University', qualification: 'B.Sc Business Admin', year: '2010' }], work: [{ place: 'Lumos Nigeria', position: 'Regional Manager' }], loanExposure: '\u20a612m auto loan (performing)', otherInvestments: 'None' },
    ],
    management: [
      { id: 'm5', name: 'Umar Faruk', education: [{ school: 'Sokoto State University', qualification: 'B.Sc Marketing', year: '2011' }], work: [{ place: 'MTN Nigeria', position: 'Territory Manager' }] },
    ],
    documents: obDocs('sah'),
    onboarding: 'submitted',
  },
  {
    company: 'GreenVolt Microgrids', rcNumber: 'RC-6612044', tin: '61220455-0001', address: '9 Old Otukpo Road, Makurdi', state: 'Benue',
    owners: [
      { id: 'o9', name: 'Terver Akaa', unitsHeld: 6500, percentHeld: 65, position: 'Managing Director', bvn: '22158834401', boardRep: true },
      { id: 'o10', name: 'Doose Iorember', unitsHeld: 3500, percentHeld: 35, position: 'Finance Director', bvn: '22158834467', boardRep: true },
    ],
    directors: [
      { id: 'd6', name: 'Terver Akaa', dob: '1986-01-30', bvn: '22158834401', education: [{ school: 'University of Agriculture Makurdi', qualification: 'B.Eng Agric & Environmental', year: '2008' }], work: [{ place: 'REA', position: 'Project Officer' }], loanExposure: 'None', otherInvestments: 'Benue AgriCoop (10%)' },
    ],
    management: [
      { id: 'm6', name: 'Doose Iorember', education: [{ school: 'Benue State University', qualification: 'B.Sc Accounting', year: '2009' }], work: [{ place: 'KPMG', position: 'Audit Senior' }] },
    ],
    documents: obDocs('grv'),
    onboarding: 'verified',
  },
  {
    company: 'Kano AgroEnergy', rcNumber: 'RC-7100238', tin: '71009822-0001', address: '5 Zaria Road, Kano', state: 'Kano',
    owners: [
      { id: 'o11', name: 'Nasir Garba', unitsHeld: 5000, percentHeld: 50, position: 'Chairman', bvn: '22147765590', boardRep: true },
      { id: 'o12', name: 'Halima Sani', unitsHeld: 5000, percentHeld: 50, position: 'Managing Director', bvn: '22147765534', boardRep: true },
    ],
    directors: [
      { id: 'd7', name: 'Halima Sani', dob: '1985-09-09', bvn: '22147765534', education: [{ school: 'Bayero University Kano', qualification: 'B.Sc Agric Economics', year: '2007' }], work: [{ place: 'Flour Mills of Nigeria', position: 'Supply Chain Manager' }], loanExposure: 'None', otherInvestments: 'None' },
    ],
    management: [
      { id: 'm7', name: 'Ibrahim Shehu', education: [{ school: 'ABU Zaria', qualification: 'B.Eng Agricultural', year: '2006' }], work: [{ place: 'Dangote Rice', position: 'Mill Operations Lead' }] },
    ],
    documents: obDocs('kan'),
    onboarding: 'submitted',
  },
  {
    company: 'Lekki BioPower', rcNumber: 'RC-8801456', tin: '88014322-0001', address: '2 Admiralty Way, Lekki', state: 'Lagos',
    owners: [
      { id: 'o13', name: 'Tomiwa Ajayi', unitsHeld: 9000, percentHeld: 90, position: 'Founder & CEO', bvn: '22136698812', boardRep: true },
      { id: 'o14', name: 'Sola Craig', unitsHeld: 1000, percentHeld: 10, position: 'Advisor', bvn: '22136698878', boardRep: false },
    ],
    directors: [
      { id: 'd8', name: 'Tomiwa Ajayi', dob: '1990-12-01', bvn: '22136698812', education: [{ school: 'University of Ibadan', qualification: 'B.Sc Microbiology', year: '2012' }], work: [{ place: 'Wecyclers', position: 'Operations Lead' }], loanExposure: '\u20a68m personal loan (performing)', otherInvestments: 'None' },
    ],
    management: [
      { id: 'm8', name: 'Sola Craig', education: [{ school: 'Lagos Business School', qualification: 'MBA', year: '2016' }], work: [{ place: 'Sterling Bank', position: 'Energy Desk' }] },
    ],
    documents: obDocs('lek'),
    onboarding: 'rejected',
  },
  {
    company: 'Enugu SolarWorks', rcNumber: 'RC-6120774', tin: '61207744-0001', address: '11 Ogui Road, Enugu', state: 'Enugu',
    owners: [
      { id: 'o15', name: 'Ikenna Okoye', unitsHeld: 7000, percentHeld: 70, position: 'Managing Director', bvn: '22125540019', boardRep: true },
      { id: 'o16', name: 'Adaeze Okoye', unitsHeld: 3000, percentHeld: 30, position: 'Executive Director', bvn: '22125540077', boardRep: true },
    ],
    directors: [
      { id: 'd9', name: 'Ikenna Okoye', dob: '1982-03-17', bvn: '22125540019', education: [{ school: 'University of Nigeria Nsukka', qualification: 'B.Eng Electrical', year: '2004' }], work: [{ place: 'PHCN', position: 'Distribution Engineer' }], loanExposure: 'None', otherInvestments: 'None' },
    ],
    management: [
      { id: 'm9', name: 'Chinedu Ani', education: [{ school: 'ESUT', qualification: 'B.Sc Accounting', year: '2008' }], work: [{ place: 'Fidelity Bank', position: 'Credit Analyst' }] },
    ],
    documents: obDocs('enu'),
    onboarding: 'verified',
  },
  {
    company: 'Rivers CleanGen', rcNumber: 'RC-7345120', tin: '73451200-0001', address: '25 Trans-Amadi Layout, Port Harcourt', state: 'Rivers',
    owners: [
      { id: 'o17', name: 'Tamuno Briggs', unitsHeld: 6000, percentHeld: 60, position: 'Chief Executive', bvn: '22114438852', boardRep: true },
      { id: 'o18', name: 'Ibiere Hart', unitsHeld: 4000, percentHeld: 40, position: 'Technical Director', bvn: '22114438890', boardRep: true },
    ],
    directors: [
      { id: 'd10', name: 'Tamuno Briggs', dob: '1980-07-22', bvn: '22114438852', education: [{ school: 'Rivers State University', qualification: 'B.Eng Marine Engineering', year: '2002' }], work: [{ place: 'Shell Nigeria', position: 'Facilities Engineer' }], loanExposure: 'None', otherInvestments: 'PH Marine Services (25%)' },
    ],
    management: [
      { id: 'm10', name: 'Boma Wokoma', education: [{ school: 'UNIPORT', qualification: 'MBA', year: '2013' }], work: [{ place: 'Zenith Bank', position: 'Energy Desk Analyst' }] },
    ],
    documents: obDocs('riv'),
    onboarding: 'verified',
  },
  {
    company: 'Oshogbo AgroMills', rcNumber: 'RC-5218830', tin: '52188300-0001', address: '8 Gbongan Road, Osogbo', state: 'Osun',
    owners: [
      { id: 'o19', name: 'Kola Ogunwale', unitsHeld: 5500, percentHeld: 55, position: 'Managing Director', bvn: '22103326671', boardRep: true },
      { id: 'o20', name: 'Funke Ogunwale', unitsHeld: 4500, percentHeld: 45, position: 'Finance Director', bvn: '22103326633', boardRep: true },
    ],
    directors: [
      { id: 'd11', name: 'Kola Ogunwale', dob: '1976-10-05', bvn: '22103326671', education: [{ school: 'Obafemi Awolowo University', qualification: 'B.Agric', year: '1999' }], work: [{ place: 'Olam Nigeria', position: 'Processing Manager' }], loanExposure: '₦30m equipment loan (performing)', otherInvestments: 'None' },
    ],
    management: [
      { id: 'm11', name: 'Wasiu Adegoke', education: [{ school: 'LAUTECH', qualification: 'B.Tech Food Science', year: '2007' }], work: [{ place: 'Honeywell Flour Mills', position: 'Plant Supervisor' }] },
    ],
    documents: obDocs('osh'),
    onboarding: 'submitted',
  },
  {
    company: 'Katsina AgriSolar', rcNumber: 'RC-8104492', tin: '81044920-0001', address: '3 Dutsinma Road, Katsina', state: 'Katsina',
    owners: [
      { id: 'o21', name: 'Bashir Lawal', unitsHeld: 6500, percentHeld: 65, position: 'Chief Executive', bvn: '22092217748', boardRep: true },
      { id: 'o22', name: 'Maryam Lawal', unitsHeld: 3500, percentHeld: 35, position: 'Operations Director', bvn: '22092217790', boardRep: false },
    ],
    directors: [
      { id: 'd12', name: 'Bashir Lawal', dob: '1984-12-11', bvn: '22092217748', education: [{ school: 'Umaru Musa Yar’adua University', qualification: 'B.Sc Agric Economics', year: '2008' }], work: [{ place: 'NIRSAL', position: 'Field Programme Officer' }], loanExposure: 'None', otherInvestments: 'None' },
    ],
    management: [
      { id: 'm12', name: 'Sadiq Rabiu', education: [{ school: 'ABU Zaria', qualification: 'B.Eng Water Resources', year: '2010' }], work: [{ place: 'FMARD', position: 'Irrigation Consultant' }] },
    ],
    documents: obDocs('kat'),
    onboarding: 'verified',
  },
  {
    company: 'Calabar HydroPower', rcNumber: 'RC-9250017', tin: '92500170-0001', address: '15 Marian Road, Calabar', state: 'Cross River',
    owners: [
      { id: 'o23', name: 'Edem Bassey', unitsHeld: 8000, percentHeld: 80, position: 'Founder & CEO', bvn: '22081109934', boardRep: true },
      { id: 'o24', name: 'Arit Ekpo', unitsHeld: 2000, percentHeld: 20, position: 'Non-Executive Director', bvn: '22081109978', boardRep: false },
    ],
    directors: [
      { id: 'd13', name: 'Edem Bassey', dob: '1979-05-02', bvn: '22081109934', education: [{ school: 'University of Calabar', qualification: 'B.Eng Civil', year: '2001' }], work: [{ place: 'CRSG Water Board', position: 'Chief Engineer' }], loanExposure: 'None', otherInvestments: 'Calabar Marina Services (15%)' },
    ],
    management: [
      { id: 'm13', name: 'Okon Etim', education: [{ school: 'UNICAL', qualification: 'B.Sc Finance', year: '2006' }], work: [{ place: 'UBA', position: 'Project Finance Associate' }] },
    ],
    documents: obDocs('cal'),
    onboarding: 'submitted',
  },
]

export const FINANCIERS: FinancierProfile[] = [
  { company: FINANCIER_CO, rcNumber: 'RC-2201884', contactName: 'Tunde Bakare', contactPhone: '08033120945', contactEmail: 't.bakare@meridiancapital.ng', contactPosition: 'Head, Structured Finance', sectorsOfInterest: ['Renewable Energy', 'Agriculture'], documents: finDocs('mer'), onboarding: 'verified' },
  { company: 'Anchorline Investments', rcNumber: 'RC-3312099', contactName: 'Bola Lawson', contactPhone: '08122340091', contactEmail: 'b.lawson@anchorline.ng', contactPosition: 'Principal', sectorsOfInterest: ['Renewable Energy'], documents: finDocs('anc'), onboarding: 'verified' },
  { company: 'Greenfield Capital', rcNumber: 'RC-8890211', contactName: 'Sani Danjuma', contactPhone: '08099887744', contactEmail: 's.danjuma@greenfield.ng', contactPosition: 'Investment Director', sectorsOfInterest: ['Renewable Energy', 'Transport'], documents: finDocs('gfc'), onboarding: 'submitted' },
  { company: 'Crescent Impact Fund', rcNumber: 'RC-9022170', contactName: 'Zara Mohammed', contactPhone: '08155600231', contactEmail: 'z.mohammed@crescentimpact.ng', contactPosition: 'Portfolio Manager', sectorsOfInterest: ['Health', 'Renewable Energy'], documents: finDocs('cif'), onboarding: 'rejected' },
  { company: 'Ivory Trust Capital', rcNumber: 'RC-4410233', contactName: 'Folake Sanni', contactPhone: '08034455112', contactEmail: 'f.sanni@ivorytrust.ng', contactPosition: 'Head of Credit', sectorsOfInterest: ['Renewable Energy', 'Health'], documents: finDocs('ivt'), onboarding: 'verified' },
  { company: 'Bluewater Partners', rcNumber: 'RC-5561900', contactName: 'Emeka Anyanwu', contactPhone: '08187722345', contactEmail: 'e.anyanwu@bluewater.ng', contactPosition: 'Managing Partner', sectorsOfInterest: ['Renewable Energy', 'Agriculture', 'Transport'], documents: finDocs('blw'), onboarding: 'verified' },
  { company: 'Northbridge Finance', rcNumber: 'RC-6672011', contactName: 'Hassan Jibril', contactPhone: '08023981144', contactEmail: 'h.jibril@northbridge.ng', contactPosition: 'Chief Investment Officer', sectorsOfInterest: ['Agriculture'], documents: finDocs('nbf'), onboarding: 'submitted' },
  { company: 'Solstice Impact Capital', rcNumber: 'RC-7783122', contactName: 'Chiamaka Obi', contactPhone: '08109283746', contactEmail: 'c.obi@solsticeimpact.ng', contactPosition: 'Deal Lead', sectorsOfInterest: ['Renewable Energy', 'Education'], documents: finDocs('sol'), onboarding: 'verified' },
  { company: 'Harmattan Ventures', rcNumber: 'RC-8894233', contactName: 'Yakubu Danladi', contactPhone: '08056677889', contactEmail: 'y.danladi@harmattan.ng', contactPosition: 'Principal', sectorsOfInterest: ['Transport'], documents: finDocs('har'), onboarding: 'rejected' },
]

/* ------------------------------- advisory --------------------------------- */

export const MESSAGES: Message[] = [
  { id: 'msg_1', ref: 'MSG-4021', fromDomain: 'admin', fromCompany: ADMIN_CO, toDomain: 'borrower', toCompany: BORROWER_CO, subject: 'Additional information on SFMP-PRJ-0001', body: 'Kindly provide the updated use-of-proceeds breakdown and the latest customer pipeline for the solar home rollout.', read: false, at: '2026-06-30T09:20:00Z', replies: [] },
  { id: 'msg_2', ref: 'MSG-4014', fromDomain: 'financier', fromCompany: FINANCIER_CO, toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Appraisal query — Bakin Ruwa mini-grid', body: 'Could you confirm the REA grant milestone schedule referenced in SFMP-PRJ-0003?', read: true, at: '2026-05-12T14:05:00Z', replies: [{ id: 'rp1', fromDomain: 'admin', fromCompany: ADMIN_CO, body: 'Confirmed — the grant is disbursed in three tranches against construction milestones.', at: '2026-05-12T16:40:00Z' }] },
  { id: 'msg_3', ref: 'MSG-3999', fromDomain: 'borrower', fromCompany: BORROWER_CO, toDomain: 'financier', toCompany: FINANCIER_CO, subject: 'Introduction — Helios Renewables', body: 'We would welcome a meeting to walk you through our C&I solar transition pipeline.', read: true, at: '2026-05-08T11:00:00Z', replies: [] },
  { id: 'msg_4', ref: 'MSG-4033', fromDomain: 'financier', fromCompany: 'Anchorline Investments', toDomain: 'borrower', toCompany: BORROWER_CO, subject: 'Ibadan North — disbursement schedule', body: 'Following acceptance of SFMP-PRJ-0008, the first tranche of 50000000 is scheduled after CP confirmation.', read: false, at: '2026-06-16T10:12:00Z', replies: [] },
  { id: 'msg_5', ref: 'MSG-4029', fromDomain: 'admin', fromCompany: ADMIN_CO, toDomain: 'financier', toCompany: FINANCIER_CO, subject: 'New recommendation — Kaduna Textile Mill Solar Retrofit', body: 'SFMP-PRJ-0010 has been recommended and matches your sectors of interest.', read: false, at: '2026-06-24T15:30:00Z', replies: [] },
  { id: 'msg_6', ref: 'MSG-4025', fromDomain: 'borrower', fromCompany: 'Savannah Power Co', toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Tariff approval documents', body: 'Uploaded the NERC tariff approval and community exclusivity agreement for Bakin Ruwa.', read: true, at: '2026-06-18T08:45:00Z', replies: [{ id: 'rp2', fromDomain: 'admin', fromCompany: ADMIN_CO, body: 'Received — appraisal pack updated.', at: '2026-06-18T10:02:00Z' }] },
  { id: 'msg_7', ref: 'MSG-4018', fromDomain: 'financier', fromCompany: FINANCIER_CO, toDomain: 'borrower', toCompany: BORROWER_CO, subject: 'Site visit request — Aba cluster', body: 'Our appraisal team would like a site visit in the week of 2026-06-08. Please propose two dates.', read: true, at: '2026-06-02T09:00:00Z', replies: [{ id: 'rp3', fromDomain: 'borrower', fromCompany: BORROWER_CO, body: 'June 9 or June 11 both work — access passes will be ready.', at: '2026-06-02T13:25:00Z' }] },
  { id: 'msg_8', ref: 'MSG-4010', fromDomain: 'admin', fromCompany: ADMIN_CO, toDomain: 'borrower', toCompany: 'Sahel Solar Ltd', subject: 'Onboarding review outcome', body: 'Your audited financials require an auditor confirmation letter before verification can proceed.', read: true, at: '2026-04-30T12:00:00Z', replies: [] },
  { id: 'msg_9', ref: 'MSG-4006', fromDomain: 'borrower', fromCompany: BORROWER_CO, toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Draft application question', body: 'For the Plateau micro-lease pilot, should the moratorium reflect the rainy-season installation window?', read: true, at: '2026-04-22T10:40:00Z', replies: [{ id: 'rp4', fromDomain: 'admin', fromCompany: ADMIN_CO, body: 'Yes — align the moratorium with your deployment plan and note it in Additional Details.', at: '2026-04-22T15:10:00Z' }] },
  { id: 'msg_10', ref: 'MSG-4002', fromDomain: 'financier', fromCompany: 'Anchorline Investments', toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Portfolio exposure summary', body: 'Requesting the quarterly exposure summary across our accepted SFMP facilities.', read: false, at: '2026-07-01T09:05:00Z', replies: [] },
  { id: 'msg_11', ref: 'MSG-3995', fromDomain: 'admin', fromCompany: ADMIN_CO, toDomain: 'financier', toCompany: 'Greenfield Capital', subject: 'Onboarding — outstanding documents', body: 'Your regulatory license upload was unreadable; please re-submit to complete verification.', read: true, at: '2026-03-28T14:20:00Z', replies: [] },
  { id: 'msg_12', ref: 'MSG-3990', fromDomain: 'borrower', fromCompany: 'Delta Renewables Ltd', toDomain: 'financier', toCompany: FINANCIER_CO, subject: 'Asaba CP progress', body: 'Security perfection filings submitted; expecting confirmation within two weeks.', read: false, at: '2026-06-29T16:55:00Z', replies: [] },
  { id: 'msg_13', ref: 'MSG-3987', fromDomain: 'financier', fromCompany: FINANCIER_CO, toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Facility pricing guidance', body: 'Is there updated pricing guidance for interconnected mini-grid facilities above 900000000?', read: true, at: '2026-03-15T11:30:00Z', replies: [] },
  { id: 'msg_14', ref: 'MSG-3980', fromDomain: 'borrower', fromCompany: BORROWER_CO, toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Thank you — verification complete', body: 'Appreciate the quick turnaround on our onboarding review.', read: true, at: '2026-03-04T09:12:00Z', replies: [] },
  { id: 'msg_15', ref: 'MSG-4035', fromDomain: 'borrower', fromCompany: 'GreenVolt Microgrids', toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Benue fleet — cooperative MOUs', body: 'All six cooperative MOUs are executed and uploaded to SFMP-PRJ-0009.', read: false, at: '2026-07-01T13:40:00Z', replies: [] },
  { id: 'msg_16', ref: 'MSG-4031', fromDomain: 'financier', fromCompany: 'Greenfield Capital', toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Verification timeline', body: 'Re-submitted the regulatory license — kindly confirm the review timeline.', read: false, at: '2026-06-27T10:18:00Z', replies: [] },
  { id: 'msg_17', ref: 'MSG-4027', fromDomain: 'borrower', fromCompany: 'Kano AgroEnergy', toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Rice mill expansion — offtake volumes', body: 'Aggregator offtake commitments total 50000000 kg annually across both contracts.', read: true, at: '2026-06-21T09:33:00Z', replies: [] },
  { id: 'msg_18', ref: 'MSG-4038', fromDomain: 'financier', fromCompany: 'Ivory Trust Capital', toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Marketplace access — sector coverage', body: 'Kindly confirm whether health-sector facilities will be live on the marketplace this quarter.', read: false, at: '2026-07-01T08:50:00Z', replies: [] },
  { id: 'msg_19', ref: 'MSG-4040', fromDomain: 'borrower', fromCompany: BORROWER_CO, toDomain: 'financier', toCompany: FINANCIER_CO, subject: 'Lagos cold-chain — appraisal documents', body: 'The depot energy audits and battery warranty terms for SFMP-PRJ-0015 are now uploaded.', read: false, at: '2026-07-02T09:10:00Z', replies: [] },
  { id: 'msg_20', ref: 'MSG-4036', fromDomain: 'admin', fromCompany: ADMIN_CO, toDomain: 'borrower', toCompany: 'Enugu SolarWorks', subject: 'Recommendation confirmed — SFMP-PRJ-0018', body: 'The Nnewi Auto-Parts Cluster Solar project has been recommended to financiers.', read: true, at: '2026-06-09T11:25:00Z', replies: [] },
  { id: 'msg_21', ref: 'MSG-4023', fromDomain: 'financier', fromCompany: 'Bluewater Partners', toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Interest in agro-processing pipeline', body: 'We would like early sight of upcoming agro-processing submissions in the South-West.', read: true, at: '2026-06-15T10:05:00Z', replies: [{ id: 'rp5', fromDomain: 'admin', fromCompany: ADMIN_CO, body: 'Noted — the Osun Cassava Processing Line is on the marketplace now.', at: '2026-06-15T14:22:00Z' }] },
  { id: 'msg_22', ref: 'MSG-4020', fromDomain: 'borrower', fromCompany: 'Rivers CleanGen', toDomain: 'admin', toCompany: ADMIN_CO, subject: 'Bonny Island — marine logistics annex', body: 'The marine logistics and O&M staffing annex for SFMP-PRJ-0019 has been uploaded.', read: true, at: '2026-06-06T09:40:00Z', replies: [] },
  { id: 'msg_23', ref: 'MSG-4042', fromDomain: 'admin', fromCompany: ADMIN_CO, toDomain: 'financier', toCompany: FINANCIER_CO, subject: 'Q3 portfolio review scheduling', body: 'Proposing the week of 2026-07-20 for the quarterly review of your accepted facilities.', read: false, at: '2026-07-02T08:15:00Z', replies: [] },
]

export const MEETINGS: Meeting[] = [
  { id: 'mtg_1', subject: 'Bakin Ruwa mini-grid appraisal review', guests: [{ domain: 'admin', company: ADMIN_CO }, { domain: 'borrower', company: 'Savannah Power Co' }], date: '2026-07-10T13:00:00Z', duration: 45, link: 'https://meet.sfmp.ng/bakin-ruwa', status: 'scheduled', hostDomain: 'financier', hostCompany: FINANCIER_CO, createdAt: '2026-06-20' },
  { id: 'mtg_2', subject: 'C&I solar transition walkthrough', guests: [{ domain: 'financier', company: FINANCIER_CO }], date: '2026-07-15T10:30:00Z', duration: 60, link: 'https://meet.sfmp.ng/ci-solar', status: 'scheduled', hostDomain: 'borrower', hostCompany: BORROWER_CO, createdAt: '2026-06-22' },
  { id: 'mtg_3', subject: 'Quarterly marketplace review', guests: [{ domain: 'borrower', company: BORROWER_CO }, { domain: 'financier', company: FINANCIER_CO }], date: '2026-07-22T09:00:00Z', duration: 90, link: 'https://meet.sfmp.ng/q3-review', status: 'scheduled', hostDomain: 'admin', hostCompany: ADMIN_CO, createdAt: '2026-06-30' },
  { id: 'mtg_4', subject: 'Ibadan North CP confirmation call', guests: [{ domain: 'borrower', company: BORROWER_CO }], date: '2026-07-08T14:00:00Z', duration: 30, link: 'https://meet.sfmp.ng/ibadan-cp', status: 'scheduled', hostDomain: 'financier', hostCompany: 'Anchorline Investments', createdAt: '2026-06-25' },
  { id: 'mtg_5', subject: 'Sector configuration workshop', guests: [{ domain: 'financier', company: FINANCIER_CO }], date: '2026-06-12T11:00:00Z', duration: 60, link: 'https://meet.sfmp.ng/sector-workshop', status: 'cancelled', hostDomain: 'admin', hostCompany: ADMIN_CO, createdAt: '2026-06-01' },
  { id: 'mtg_6', subject: 'Warri Port solar — CP checklist review', guests: [{ domain: 'borrower', company: 'Delta Renewables Ltd' }], date: '2026-07-18T11:00:00Z', duration: 45, link: 'https://meet.sfmp.ng/warri-cp', status: 'scheduled', hostDomain: 'financier', hostCompany: FINANCIER_CO, createdAt: '2026-06-28' },
  { id: 'mtg_7', subject: 'Onboarding walkthrough — Northbridge Finance', guests: [{ domain: 'financier', company: 'Northbridge Finance' }], date: '2026-07-09T10:00:00Z', duration: 30, link: 'https://meet.sfmp.ng/northbridge-onboarding', status: 'scheduled', hostDomain: 'admin', hostCompany: ADMIN_CO, createdAt: '2026-06-29' },
  { id: 'mtg_8', subject: 'Calabar municipal feeder — technical screening', guests: [{ domain: 'borrower', company: 'Calabar HydroPower' }], date: '2026-07-24T13:30:00Z', duration: 60, link: 'https://meet.sfmp.ng/calabar-screening', status: 'scheduled', hostDomain: 'admin', hostCompany: ADMIN_CO, createdAt: '2026-07-01' },
  { id: 'mtg_9', subject: 'PAYG portfolio deep-dive', guests: [{ domain: 'borrower', company: BORROWER_CO }], date: '2026-07-29T09:30:00Z', duration: 60, link: 'https://meet.sfmp.ng/payg-deepdive', status: 'scheduled', hostDomain: 'financier', hostCompany: 'Ivory Trust Capital', createdAt: '2026-07-02' },
  { id: 'mtg_10', subject: 'Cookstove collective revival planning', guests: [{ domain: 'admin', company: ADMIN_CO }], date: '2026-06-19T15:00:00Z', duration: 45, link: 'https://meet.sfmp.ng/cookstove-revival', status: 'cancelled', hostDomain: 'financier', hostCompany: FINANCIER_CO, createdAt: '2026-06-10' },
]

/* ------------------------------ communities ------------------------------- */

export const COMMUNITIES: Community[] = [
  {
    id: 'com_1', name: 'Jos Solar Traders Cooperative', description: 'A cooperative of solar equipment traders and installers in Plateau State.', location: 'Jos, Plateau', status: 'active',
    leaders: [{ id: 'l1', name: 'Musa Danjuma', phone: '08031122334', role: 'leader', status: 'active' }],
    members: [
      { id: 'cm1', name: 'Grace Madu', phone: '08144556677', role: 'member', status: 'active' },
      { id: 'cm2', name: 'Yusuf Kano', phone: '08099001122', role: 'member', status: 'active' },
      { id: 'cm3', name: 'Peace Etim', phone: '08066778899', role: 'member', status: 'pending' },
      { id: 'cm4', name: 'Ibrahim Waziri', phone: '08033445566', role: 'member', status: 'inactive' },
      { id: 'cm7', name: 'Tunde Salako', phone: '08122098834', role: 'member', status: 'active' },
      { id: 'cm8', name: 'Rahila Bulus', phone: '08065512290', role: 'member', status: 'active' },
      { id: 'cm9', name: 'Kefas Dung', phone: '08033218876', role: 'member', status: 'active' },
      { id: 'cm10', name: 'Ladi Gyang', phone: '08155093321', role: 'member', status: 'active' },
      { id: 'cm11', name: 'Amos Pam', phone: '08090227745', role: 'member', status: 'pending' },
      { id: 'cm12', name: 'Naomi Gotom', phone: '08144330912', role: 'member', status: 'active' },
    ],
    offers: [
      { id: 'of1', name: 'Solar Stock Advance', tenor: 12, rate: 5, subscribers: 8 },
      { id: 'of2', name: 'Installer Toolkit Loan', tenor: 6, rate: 3.5, subscribers: 14 },
      { id: 'of4', name: 'Growth Capital Loan', tenor: 18, rate: 6.5, subscribers: 5 },
    ],
  },
  {
    id: 'com_2', name: 'Kaduna Clean Cookstoves Collective', description: 'Women-led collective distributing clean cookstoves and briquettes across Kaduna markets.', location: 'Kaduna', status: 'inactive',
    leaders: [{ id: 'l2', name: 'Hadiza Yusuf', phone: '08022334455', role: 'leader', status: 'active' }],
    members: [
      { id: 'cm5', name: 'Blessing Audu', phone: '08155667788', role: 'member', status: 'active' },
      { id: 'cm6', name: 'Mary John', phone: '08077889900', role: 'member', status: 'active' },
      { id: 'cm13', name: 'Rifkatu Yakubu', phone: '08022110987', role: 'member', status: 'active' },
      { id: 'cm14', name: 'Esther Bala', phone: '08133892210', role: 'member', status: 'active' },
      { id: 'cm15', name: 'Salamatu Idris', phone: '08099445673', role: 'member', status: 'pending' },
      { id: 'cm16', name: 'Joy Markus', phone: '08066120945', role: 'member', status: 'active' },
      { id: 'cm17', name: 'Deborah Sani', phone: '08151198320', role: 'member', status: 'inactive' },
    ],
    offers: [
      { id: 'of3', name: 'Market Day Float', tenor: 3, rate: 2.5, subscribers: 21 },
      { id: 'of5', name: 'Cookstove Restock Loan', tenor: 9, rate: 4, subscribers: 9 },
    ],
  },
]

export const LOAN_APPLICATIONS: LoanApplication[] = [
  { id: 'la_1', ref: 'CL-2201', communityId: 'com_1', memberName: 'Grace Madu', phone: '08144556677', address: '12 Rukuba Road, Jos', gender: 'Female', dob: '1990-02-14', nationality: 'Nigerian', state: 'Plateau', landmark: 'Near Terminus Market', amount: 1_500_000, bvn: '22190011223', tin: '10029384-0001', sector: 'Renewable Energy', monthlySalary: 350_000, account: '0123456789', documents: [], status: 'pending', at: '2026-06-25' },
  { id: 'la_2', ref: 'CL-2199', communityId: 'com_1', memberName: 'Yusuf Kano', phone: '08099001122', address: '4 Bauchi Ring Road, Jos', gender: 'Male', dob: '1987-09-30', nationality: 'Nigerian', state: 'Plateau', landmark: 'Opposite Gada Biu Park', amount: 900_000, bvn: '22190011456', tin: '10029385-0001', sector: 'Renewable Energy', monthlySalary: 280_000, account: '0234567891', documents: [], status: 'approved', at: '2026-06-18' },
  { id: 'la_3', ref: 'CL-2185', communityId: 'com_1', memberName: 'Musa Danjuma', phone: '08031122334', address: '30 Zaria Bypass, Jos', gender: 'Male', dob: '1979-05-21', nationality: 'Nigerian', state: 'Plateau', landmark: 'Behind NEPA office', amount: 2_400_000, bvn: '22190011789', tin: '10029386-0001', sector: 'Renewable Energy', monthlySalary: 520_000, account: '0345678912', documents: [], status: 'disbursed', at: '2026-05-30' },
  { id: 'la_4', ref: 'CL-2170', communityId: 'com_1', memberName: 'Peace Etim', phone: '08066778899', address: '7 Farin Gada Road, Jos', gender: 'Female', dob: '1993-12-08', nationality: 'Nigerian', state: 'Plateau', landmark: 'Near St. Luke’s', amount: 3_000_000, bvn: '22190011901', tin: '10029387-0001', sector: 'Renewable Energy', monthlySalary: 210_000, account: '0456789123', documents: [], status: 'rejected', at: '2026-05-12' },
  { id: 'la_5', ref: 'CL-2210', communityId: 'com_2', memberName: 'Blessing Audu', phone: '08155667788', address: '18 Constitution Road, Kaduna', gender: 'Female', dob: '1991-07-04', nationality: 'Nigerian', state: 'Kaduna', landmark: 'Near Central Market gate', amount: 650_000, bvn: '22190012034', tin: '10029388-0001', sector: 'Others', monthlySalary: 190_000, account: '0567891234', documents: [], status: 'pending', at: '2026-06-29' },
  { id: 'la_6', ref: 'CL-2214', communityId: 'com_1', memberName: 'Tunde Salako', phone: '08122098834', address: '9 Bukuru Expressway, Jos', gender: 'Male', dob: '1985-03-11', nationality: 'Nigerian', state: 'Plateau', landmark: 'Near Plaza Cinema junction', amount: 1_200_000, bvn: '22190012156', tin: '10029389-0001', sector: 'Renewable Energy', monthlySalary: 310_000, account: '0678912345', documents: [], status: 'pending', at: '2026-06-30' },
  { id: 'la_7', ref: 'CL-2208', communityId: 'com_1', memberName: 'Rahila Bulus', phone: '08065512290', address: '21 Ahmadu Bello Way, Jos', gender: 'Female', dob: '1992-08-19', nationality: 'Nigerian', state: 'Plateau', landmark: 'Opposite Standard Building', amount: 800_000, bvn: '22190012278', tin: '10029390-0001', sector: 'Renewable Energy', monthlySalary: 240_000, account: '0789123456', documents: [], status: 'approved', at: '2026-06-22' },
  { id: 'la_8', ref: 'CL-2196', communityId: 'com_1', memberName: 'Kefas Dung', phone: '08033218876', address: '5 Ring Road, Rayfield, Jos', gender: 'Male', dob: '1983-01-27', nationality: 'Nigerian', state: 'Plateau', landmark: 'Near Rayfield Resort', amount: 1_800_000, bvn: '22190012391', tin: '10029391-0001', sector: 'Renewable Energy', monthlySalary: 430_000, account: '0891234567', documents: [], status: 'disbursed', at: '2026-06-05' },
  { id: 'la_9', ref: 'CL-2190', communityId: 'com_1', memberName: 'Ladi Gyang', phone: '08155093321', address: '14 Tudun Wada Road, Jos', gender: 'Female', dob: '1994-11-02', nationality: 'Nigerian', state: 'Plateau', landmark: 'Behind Gada Biu Market', amount: 700_000, bvn: '22190012413', tin: '10029392-0001', sector: 'Renewable Energy', monthlySalary: 205_000, account: '0912345678', documents: [], status: 'approved', at: '2026-05-27' },
  { id: 'la_10', ref: 'CL-2182', communityId: 'com_1', memberName: 'Amos Pam', phone: '08090227745', address: '2 Vom Road, Jos South', gender: 'Male', dob: '1988-06-16', nationality: 'Nigerian', state: 'Plateau', landmark: 'Near NVRI gate', amount: 2_100_000, bvn: '22190012535', tin: '10029393-0001', sector: 'Renewable Energy', monthlySalary: 380_000, account: '0123456780', documents: [], status: 'rejected', at: '2026-05-15' },
  { id: 'la_11', ref: 'CL-2176', communityId: 'com_1', memberName: 'Naomi Gotom', phone: '08144330912', address: '31 Zaria Road, Jos', gender: 'Female', dob: '1990-09-23', nationality: 'Nigerian', state: 'Plateau', landmark: 'Close to Unijos gate', amount: 950_000, bvn: '22190012657', tin: '10029394-0001', sector: 'Renewable Energy', monthlySalary: 260_000, account: '0234567801', documents: [], status: 'disbursed', at: '2026-05-08' },
  { id: 'la_12', ref: 'CL-2216', communityId: 'com_2', memberName: 'Mary John', phone: '08077889900', address: '6 Ibrahim Taiwo Road, Kaduna', gender: 'Female', dob: '1989-04-30', nationality: 'Nigerian', state: 'Kaduna', landmark: 'Near Leventis roundabout', amount: 480_000, bvn: '22190012779', tin: '10029395-0001', sector: 'Others', monthlySalary: 175_000, account: '0345678012', documents: [], status: 'pending', at: '2026-07-01' },
  { id: 'la_13', ref: 'CL-2204', communityId: 'com_2', memberName: 'Rifkatu Yakubu', phone: '08022110987', address: '12 Kachia Road, Kaduna', gender: 'Female', dob: '1993-02-08', nationality: 'Nigerian', state: 'Kaduna', landmark: 'Opposite Queen Amina College', amount: 550_000, bvn: '22190012891', tin: '10029396-0001', sector: 'Others', monthlySalary: 185_000, account: '0456780123', documents: [], status: 'approved', at: '2026-06-17' },
  { id: 'la_14', ref: 'CL-2192', communityId: 'com_2', memberName: 'Esther Bala', phone: '08133892210', address: '27 Junction Road, Kaduna', gender: 'Female', dob: '1987-12-14', nationality: 'Nigerian', state: 'Kaduna', landmark: 'Near Kasuwan Barci', amount: 720_000, bvn: '22190012913', tin: '10029397-0001', sector: 'Others', monthlySalary: 220_000, account: '0567801234', documents: [], status: 'disbursed', at: '2026-05-25' },
  { id: 'la_15', ref: 'CL-2186', communityId: 'com_2', memberName: 'Salamatu Idris', phone: '08099445673', address: '3 Nnamdi Azikiwe Way, Kaduna', gender: 'Female', dob: '1995-05-06', nationality: 'Nigerian', state: 'Kaduna', landmark: 'Near Murtala Square', amount: 400_000, bvn: '22190013035', tin: '10029398-0001', sector: 'Others', monthlySalary: 150_000, account: '0678012345', documents: [], status: 'rejected', at: '2026-05-10' },
]

/* -------------------------------- personas -------------------------------- */

export const PERSONAS: Persona[] = [
  { id: 'ps_b1', name: 'Amara Okonkwo', email: 'a.okonkwo@heliosrenewables.ng', phone: '08031002001', domain: 'borrower', subRole: 'root', status: 'active', createdAt: '2026-01-10' },
  { id: 'ps_b2', name: 'Chidi Balogun', email: 'c.balogun@heliosrenewables.ng', phone: '08031002002', domain: 'borrower', subRole: 'initiator', status: 'active', createdAt: '2026-01-12' },
  { id: 'ps_b3', name: 'Fatima Bello', email: 'f.bello@heliosrenewables.ng', phone: '08031002003', domain: 'borrower', subRole: 'authorizer', status: 'active', createdAt: '2026-01-12' },
  { id: 'ps_b4', name: 'Emeka Obi', email: 'e.obi@heliosrenewables.ng', phone: '08031002004', domain: 'borrower', subRole: 'initiator', status: 'inactive', createdAt: '2026-02-02' },
  { id: 'ps_b6', name: 'Yemi Adewale', email: 'y.adewale@heliosrenewables.ng', phone: '08031002006', domain: 'borrower', subRole: 'initiator', status: 'active', createdAt: '2026-06-11' },
  { id: 'ps_b7', name: 'Halima Yusuf', email: 'h.yusuf@heliosrenewables.ng', phone: '08031002007', domain: 'borrower', subRole: 'authorizer', status: 'active', createdAt: '2026-05-19' },
  { id: 'ps_b8', name: 'Obinna Nwachukwu', email: 'o.nwachukwu@heliosrenewables.ng', phone: '08031002008', domain: 'borrower', subRole: 'initiator', status: 'active', createdAt: '2026-03-30' },
  { id: 'ps_b9', name: 'Ronke Alabi', email: 'r.alabi@heliosrenewables.ng', phone: '08031002009', domain: 'borrower', subRole: 'authorizer', status: 'inactive', createdAt: '2026-03-08' },
  { id: 'ps_b10', name: 'Sani Mustapha', email: 's.mustapha@heliosrenewables.ng', phone: '08031002010', domain: 'borrower', subRole: 'initiator', status: 'active', createdAt: '2026-02-20' },
  { id: 'ps_b11', name: 'Ifeoma Chukwu', email: 'i.chukwu@heliosrenewables.ng', phone: '08031002011', domain: 'borrower', subRole: 'initiator', status: 'active', createdAt: '2026-02-06' },
  { id: 'ps_f1', name: 'Tunde Bakare', email: 't.bakare@meridiancapital.ng', phone: '08033120945', domain: 'financier', subRole: 'root', status: 'active', createdAt: '2026-02-01' },
  { id: 'ps_f2', name: 'Kemi Adeyemi', email: 'k.adeyemi@meridiancapital.ng', phone: '08033120946', domain: 'financier', subRole: 'initiator', status: 'active', createdAt: '2026-02-03' },
  { id: 'ps_f3', name: 'Wale Ojo', email: 'w.ojo@meridiancapital.ng', phone: '08033120947', domain: 'financier', subRole: 'authorizer', status: 'active', createdAt: '2026-02-03' },
  { id: 'ps_f4', name: 'Dapo Ogunlesi', email: 'd.ogunlesi@meridiancapital.ng', phone: '08033120948', domain: 'financier', subRole: 'initiator', status: 'active', createdAt: '2026-05-15' },
  { id: 'ps_f5', name: 'Amina Zubairu', email: 'a.zubairu@meridiancapital.ng', phone: '08033120949', domain: 'financier', subRole: 'authorizer', status: 'active', createdAt: '2026-04-14' },
  { id: 'ps_f6', name: 'Chuka Umeh', email: 'c.umeh@meridiancapital.ng', phone: '08033120950', domain: 'financier', subRole: 'initiator', status: 'inactive', createdAt: '2026-03-22' },
  { id: 'ps_f7', name: 'Bisi Falana', email: 'b.falana@meridiancapital.ng', phone: '08033120951', domain: 'financier', subRole: 'initiator', status: 'active', createdAt: '2026-03-05' },
  { id: 'ps_f8', name: 'Nneka Ibe', email: 'n.ibe@meridiancapital.ng', phone: '08033120952', domain: 'financier', subRole: 'authorizer', status: 'active', createdAt: '2026-02-25' },
  { id: 'ps_f9', name: 'Garba Dikko', email: 'g.dikko@meridiancapital.ng', phone: '08033120953', domain: 'financier', subRole: 'initiator', status: 'active', createdAt: '2026-02-10' },
  { id: 'ps_a1', name: 'Ngozi Eze', email: 'n.eze@sfmp.sterling.ng', phone: '08029110022', domain: 'admin', subRole: 'root', status: 'active', createdAt: '2025-12-01' },
  { id: 'ps_a2', name: 'Ibrahim Suleiman', email: 'i.suleiman@sfmp.sterling.ng', phone: '08029110033', domain: 'admin', subRole: 'initiator', status: 'active', createdAt: '2025-12-05' },
  { id: 'ps_a3', name: 'Hauwa Lawal', email: 'h.lawal@sfmp.sterling.ng', phone: '08029110044', domain: 'admin', subRole: 'authorizer', status: 'active', createdAt: '2025-12-05' },
  { id: 'ps_a4', name: 'Tope Alade', email: 't.alade@sfmp.sterling.ng', phone: '08029110055', domain: 'admin', subRole: 'initiator', status: 'active', createdAt: '2026-05-11' },
  { id: 'ps_a5', name: 'Zainab Aliyu', email: 'z.aliyu@sfmp.sterling.ng', phone: '08029110066', domain: 'admin', subRole: 'authorizer', status: 'active', createdAt: '2026-04-08' },
  { id: 'ps_a6', name: 'Kunle Afolabi', email: 'k.afolabi@sfmp.sterling.ng', phone: '08029110077', domain: 'admin', subRole: 'initiator', status: 'active', createdAt: '2026-03-17' },
  { id: 'ps_a7', name: 'Chioma Duru', email: 'c.duru@sfmp.sterling.ng', phone: '08029110088', domain: 'admin', subRole: 'initiator', status: 'inactive', createdAt: '2026-02-19' },
  { id: 'ps_a8', name: 'Musa Bello', email: 'm.bello@sfmp.sterling.ng', phone: '08029110099', domain: 'admin', subRole: 'authorizer', status: 'active', createdAt: '2026-01-28' },
  { id: 'ps_a9', name: 'Ejiro Akpore', email: 'e.akpore@sfmp.sterling.ng', phone: '08029110100', domain: 'admin', subRole: 'initiator', status: 'active', createdAt: '2026-01-15' },
]

/* ----------------------------- approvals queue ---------------------------- */

/** A real pending sector change: activating Transport with an EV facility type.
 *  Approving this from the admin authorizer queue publishes it marketplace-wide. */
const TRANSPORT_CHANGE: Sector = {
  id: 'sec_transport',
  name: 'Transport',
  status: 'pending',
  facilityTypes: [
    {
      id: 'ft_ev',
      name: 'EV Charging Infrastructure',
      tooltip: 'Financing for public and fleet EV charging stations with grid or solar supply.',
      documentSections: [
        { id: 'moa', name: 'Memorandum & Articles of Association', description: 'The company’s registered MEMART.' },
        { id: 'cac', name: 'CAC status report', description: 'Current CAC status report.' },
        { id: 'site_rights', name: 'Site rights & permits', description: 'Evidence of site control and installation permits.' },
        { id: 'fin_model', name: 'Financial model demonstrating viability', description: 'Utilisation-based charging revenue model.' },
        { id: 'others', name: 'Others', description: 'Any additional supporting documents.', multiple: true },
      ],
    },
  ],
  detailFields: [
    { id: 'tf_1', name: 'Charge points planned', section: 'Project Details', description: 'Total number of charge points in scope.', type: 'number' },
  ],
  additionalFields: [],
}

export const APPROVALS: Approval[] = [
  { id: 'ap_1', ref: 'APR-5010', domain: 'admin', type: 'sector_change', title: 'Publish Transport sector with EV facility type', description: 'Initiator configured the Transport sector with an “EV Charging Infrastructure” facility type and project fields.', payload: { sector: TRANSPORT_CHANGE }, submittedBy: 'Ibrahim Suleiman', status: 'pending', at: '2026-06-28T10:12:00Z' },
  { id: 'ap_2', ref: 'APR-5008', domain: 'admin', type: 'project_recommend', title: 'Recommend SFMP-PRJ-0009 to marketplace', description: 'Recommend the Benue Solar Home Fleet (GreenVolt Microgrids) to financiers.', payload: { projectId: 'prj_8' }, submittedBy: 'Ibrahim Suleiman', status: 'pending', at: '2026-06-27T15:40:00Z' },
  { id: 'ap_3', ref: 'APR-4991', domain: 'admin', type: 'project_recommend', title: 'Recommend SFMP-PRJ-0002 to marketplace', description: 'Recommend the Aba Industrial Cluster Solar Transition to financiers.', payload: { projectId: 'prj_2' }, submittedBy: 'Ibrahim Suleiman', status: 'approved', reviewedBy: 'Hauwa Lawal', at: '2026-05-24T09:00:00Z', reviewedAt: '2026-05-25T08:30:00Z' },
  { id: 'ap_4', ref: 'APR-4975', domain: 'admin', type: 'sector_create', title: 'Create sector — Maritime Logistics', description: 'New sector proposal with two facility types.', payload: {}, submittedBy: 'Ibrahim Suleiman', status: 'rejected', reviewedBy: 'Hauwa Lawal', note: 'Out of current mandate — revisit after the Transport rollout.', at: '2026-05-02T13:00:00Z', reviewedAt: '2026-05-03T10:15:00Z' },
  { id: 'ap_5', ref: 'APR-5012', domain: 'borrower', type: 'persona_create', title: 'Add analyst persona — Ada Nwankwo', description: 'New initiator persona for the project finance team.', payload: { persona: { id: 'ps_b5', name: 'Ada Nwankwo', email: 'a.nwankwo@heliosrenewables.ng', phone: '08031002005', domain: 'borrower', subRole: 'initiator', status: 'active', createdAt: '2026-07-01' } }, submittedBy: 'Chidi Balogun', status: 'pending', at: '2026-07-01T11:20:00Z' },
  { id: 'ap_6', ref: 'APR-5005', domain: 'financier', type: 'project_accept', title: 'Accept SFMP-PRJ-0003 for funding', description: 'Initiator proposes accepting the Bakin Ruwa Isolated Mini-Grid after appraisal.', payload: { projectId: 'prj_3' }, submittedBy: 'Kemi Adeyemi', status: 'pending', at: '2026-06-26T09:45:00Z' },
  { id: 'ap_7', ref: 'APR-4968', domain: 'financier', type: 'offer_publish', title: 'Publish community offer — Solar Stock Advance', description: '12-month, 5% stock advance for the Jos Solar Traders Cooperative.', payload: { communityId: 'com_1', offer: { id: 'of1', name: 'Solar Stock Advance', tenor: 12, rate: 5, subscribers: 0 } }, submittedBy: 'Kemi Adeyemi', status: 'approved', reviewedBy: 'Wale Ojo', at: '2026-04-10T10:00:00Z', reviewedAt: '2026-04-10T16:20:00Z' },
  { id: 'ap_8', ref: 'APR-5011', domain: 'admin', type: 'project_recommend', title: 'Recommend SFMP-PRJ-0025 to marketplace', description: 'Recommend the Calabar Municipal Feeder (Calabar HydroPower) to financiers.', payload: { projectId: 'prj_24' }, submittedBy: 'Ibrahim Suleiman', status: 'pending', at: '2026-06-30T14:05:00Z' },
  { id: 'ap_9', ref: 'APR-4998', domain: 'admin', type: 'project_recommend', title: 'Recommend SFMP-PRJ-0018 to marketplace', description: 'Recommend the Nnewi Auto-Parts Cluster Solar to financiers.', payload: { projectId: 'prj_17' }, submittedBy: 'Tope Alade', status: 'approved', reviewedBy: 'Hauwa Lawal', at: '2026-06-08T10:30:00Z', reviewedAt: '2026-06-09T09:15:00Z' },
  { id: 'ap_10', ref: 'APR-4989', domain: 'admin', type: 'project_recommend', title: 'Recommend SFMP-PRJ-0019 to marketplace', description: 'Recommend the Bonny Island Mini-Grid to financiers.', payload: { projectId: 'prj_18' }, submittedBy: 'Kunle Afolabi', status: 'approved', reviewedBy: 'Zainab Aliyu', at: '2026-05-29T11:10:00Z', reviewedAt: '2026-05-31T08:45:00Z' },
  { id: 'ap_11', ref: 'APR-4980', domain: 'admin', type: 'persona_create', title: 'Add initiator persona — Tope Alade', description: 'New initiator persona for the marketplace operations team.', payload: {}, submittedBy: 'Ibrahim Suleiman', status: 'approved', reviewedBy: 'Hauwa Lawal', at: '2026-05-10T09:20:00Z', reviewedAt: '2026-05-11T10:05:00Z' },
  { id: 'ap_12', ref: 'APR-4970', domain: 'admin', type: 'sector_change', title: 'Update Agriculture document pack', description: 'Add a warehouse-receipt section to the agro-processing facility type.', payload: {}, submittedBy: 'Kunle Afolabi', status: 'rejected', reviewedBy: 'Zainab Aliyu', note: 'Hold until the harmonised collateral policy is issued.', at: '2026-04-24T13:40:00Z', reviewedAt: '2026-04-25T09:30:00Z' },
  { id: 'ap_13', ref: 'APR-4960', domain: 'admin', type: 'persona_create', title: 'Add authorizer persona — Zainab Aliyu', description: 'New authorizer persona for the approvals desk.', payload: {}, submittedBy: 'Ibrahim Suleiman', status: 'approved', reviewedBy: 'Hauwa Lawal', at: '2026-04-07T10:00:00Z', reviewedAt: '2026-04-08T08:50:00Z' },
  { id: 'ap_14', ref: 'APR-5001', domain: 'borrower', type: 'persona_create', title: 'Add initiator persona — Yemi Adewale', description: 'New initiator persona for the origination team.', payload: {}, submittedBy: 'Chidi Balogun', status: 'approved', reviewedBy: 'Fatima Bello', at: '2026-06-10T12:00:00Z', reviewedAt: '2026-06-11T09:40:00Z' },
  { id: 'ap_15', ref: 'APR-4985', domain: 'borrower', type: 'persona_create', title: 'Add authorizer persona — Halima Yusuf', description: 'New authorizer persona for the finance office.', payload: {}, submittedBy: 'Chidi Balogun', status: 'approved', reviewedBy: 'Fatima Bello', at: '2026-05-18T11:15:00Z', reviewedAt: '2026-05-19T10:25:00Z' },
  { id: 'ap_16', ref: 'APR-4972', domain: 'borrower', type: 'persona_create', title: 'Add intern persona — Seun Ajayi', description: 'Temporary initiator persona for a project-finance intern.', payload: {}, submittedBy: 'Chidi Balogun', status: 'rejected', reviewedBy: 'Fatima Bello', note: 'Interns should not hold initiator rights.', at: '2026-04-27T14:50:00Z', reviewedAt: '2026-04-28T09:05:00Z' },
  { id: 'ap_17', ref: 'APR-4955', domain: 'borrower', type: 'persona_create', title: 'Add initiator persona — Obinna Nwachukwu', description: 'New initiator persona for the technical team.', payload: {}, submittedBy: 'Chidi Balogun', status: 'approved', reviewedBy: 'Fatima Bello', at: '2026-03-29T10:35:00Z', reviewedAt: '2026-03-30T08:55:00Z' },
  { id: 'ap_18', ref: 'APR-5003', domain: 'financier', type: 'project_accept', title: 'Accept SFMP-PRJ-0023 for funding', description: 'Accept the Warri Port Logistics Solar after appraisal and site visit.', payload: {}, submittedBy: 'Dapo Ogunlesi', status: 'approved', reviewedBy: 'Wale Ojo', at: '2026-06-04T15:20:00Z', reviewedAt: '2026-06-05T09:10:00Z' },
  { id: 'ap_19', ref: 'APR-4996', domain: 'financier', type: 'offer_publish', title: 'Publish community offer — Cookstove Restock Loan', description: '9-month, 4% restock loan for the Kaduna Clean Cookstoves Collective.', payload: { communityId: 'com_2', offer: { id: 'of6', name: 'Cookstove Restock Loan II', tenor: 9, rate: 4, subscribers: 0 } }, submittedBy: 'Kemi Adeyemi', status: 'pending', at: '2026-06-29T10:45:00Z' },
  { id: 'ap_20', ref: 'APR-4982', domain: 'financier', type: 'persona_create', title: 'Add initiator persona — Bisi Falana', description: 'New initiator persona for the deal team.', payload: {}, submittedBy: 'Tunde Bakare', status: 'approved', reviewedBy: 'Wale Ojo', at: '2026-05-14T09:30:00Z', reviewedAt: '2026-05-15T08:40:00Z' },
  { id: 'ap_21', ref: 'APR-4977', domain: 'financier', type: 'project_accept', title: 'Accept SFMP-PRJ-0010 for funding', description: 'Proposal to accept the Kaduna Textile Mill Solar Retrofit.', payload: {}, submittedBy: 'Kemi Adeyemi', status: 'rejected', reviewedBy: 'Wale Ojo', note: 'Await updated collection performance data before committing.', at: '2026-05-05T13:00:00Z', reviewedAt: '2026-05-06T10:20:00Z' },
  { id: 'ap_22', ref: 'APR-4964', domain: 'financier', type: 'persona_create', title: 'Add authorizer persona — Nneka Ibe', description: 'New authorizer persona for the credit committee.', payload: {}, submittedBy: 'Tunde Bakare', status: 'approved', reviewedBy: 'Wale Ojo', at: '2026-04-13T11:00:00Z', reviewedAt: '2026-04-14T09:25:00Z' },
]

/* -------------------------------- audit ----------------------------------- */

export const AUDIT: AuditEntry[] = [
  { id: 'au_1', ip: '102.89.34.12', user: 'Ibrahim Suleiman', domain: 'admin', module: 'Sectors', activity: 'Submitted Transport sector changes for approval', at: '2026-06-28T10:12:00Z' },
  { id: 'au_2', ip: '197.210.44.9', user: 'Hauwa Lawal', domain: 'admin', module: 'Approvals', activity: 'Approved APR-4991 — Recommend SFMP-PRJ-0002 to marketplace', at: '2026-05-25T08:30:00Z', changes: [{ field: 'status', from: 'pending', to: 'approved' }] },
  { id: 'au_3', ip: '197.210.44.9', user: 'Ngozi Eze', domain: 'admin', module: 'Projects', activity: 'Recommended SFMP-PRJ-0010 to the marketplace', at: '2026-06-24T15:40:00Z', changes: [{ field: 'status', from: 'on_marketplace', to: 'recommended' }] },
  { id: 'au_4', ip: '105.112.20.7', user: 'Tunde Bakare', domain: 'financier', module: 'Projects', activity: 'Selected SFMP-PRJ-0003 for funding', at: '2026-05-12T09:05:00Z', changes: [{ field: 'status', from: 'recommended', to: 'selected' }] },
  { id: 'au_5', ip: '105.112.20.9', user: 'Bola Lawson', domain: 'financier', module: 'Projects', activity: 'Accepted SFMP-PRJ-0008', at: '2026-06-14T11:32:00Z', changes: [{ field: 'status', from: 'selected', to: 'accepted' }] },
  { id: 'au_6', ip: '41.58.101.3', user: 'Amara Okonkwo', domain: 'borrower', module: 'Projects', activity: 'Submitted SFMP-PRJ-0001 to the marketplace', at: '2026-05-14T08:22:00Z' },
  { id: 'au_7', ip: '41.58.101.3', user: 'Amara Okonkwo', domain: 'borrower', module: 'Projects', activity: 'Completed acceptance checklist for SFMP-PRJ-0008', at: '2026-06-15T10:05:00Z', changes: [{ field: 'checklist', from: '0/4', to: '4/4' }, { field: 'repayment', from: '—', to: 'quarterly · ₦41,500,000' }] },
  { id: 'au_8', ip: '197.210.44.9', user: 'Ngozi Eze', domain: 'admin', module: 'Onboarding', activity: 'Verified borrower GreenVolt Microgrids', at: '2026-06-10T09:00:00Z', changes: [{ field: 'onboarding', from: 'submitted', to: 'verified' }] },
  { id: 'au_9', ip: '197.210.44.9', user: 'Ngozi Eze', domain: 'admin', module: 'Onboarding', activity: 'Declined financier Crescent Impact Fund', at: '2026-05-28T14:40:00Z', changes: [{ field: 'onboarding', from: 'submitted', to: 'rejected' }] },
  { id: 'au_10', ip: '102.89.34.12', user: 'Ibrahim Suleiman', domain: 'admin', module: 'User Management', activity: 'Deactivated persona Emeka Obi (borrower initiator)', at: '2026-04-15T12:10:00Z', changes: [{ field: 'status', from: 'active', to: 'inactive' }] },
  { id: 'au_11', ip: '105.112.20.7', user: 'Kemi Adeyemi', domain: 'financier', module: 'Communities', activity: 'Published offer “Installer Toolkit Loan” to Jos Solar Traders Cooperative', at: '2026-04-12T10:30:00Z' },
  { id: 'au_12', ip: '41.58.101.5', user: 'Chidi Balogun', domain: 'borrower', module: 'Messages', activity: 'Sent MSG-3999 to Meridian Capital Partners', at: '2026-05-08T11:00:00Z' },
  { id: 'au_13', ip: '41.58.101.3', user: 'Amara Okonkwo', domain: 'borrower', module: 'Projects', activity: 'Submitted SFMP-PRJ-0012 to the marketplace', at: '2026-06-15T09:18:00Z' },
  { id: 'au_14', ip: '197.210.44.9', user: 'Hauwa Lawal', domain: 'admin', module: 'Approvals', activity: 'Approved APR-4998 — Recommend SFMP-PRJ-0018 to marketplace', at: '2026-06-09T09:15:00Z', changes: [{ field: 'status', from: 'pending', to: 'approved' }] },
  { id: 'au_15', ip: '102.89.34.15', user: 'Zainab Aliyu', domain: 'admin', module: 'Approvals', activity: 'Approved APR-4989 — Recommend SFMP-PRJ-0019 to marketplace', at: '2026-05-31T08:45:00Z', changes: [{ field: 'status', from: 'pending', to: 'approved' }] },
  { id: 'au_16', ip: '105.112.20.7', user: 'Tunde Bakare', domain: 'financier', module: 'Projects', activity: 'Selected SFMP-PRJ-0015 for funding', at: '2026-06-19T10:40:00Z', changes: [{ field: 'status', from: 'recommended', to: 'selected' }] },
  { id: 'au_17', ip: '105.112.20.9', user: 'Wale Ojo', domain: 'financier', module: 'Approvals', activity: 'Approved APR-5003 — Accept SFMP-PRJ-0023 for funding', at: '2026-06-05T09:10:00Z', changes: [{ field: 'status', from: 'pending', to: 'approved' }] },
  { id: 'au_18', ip: '197.210.44.9', user: 'Ngozi Eze', domain: 'admin', module: 'Onboarding', activity: 'Verified borrower Enugu SolarWorks', at: '2026-05-20T10:15:00Z', changes: [{ field: 'onboarding', from: 'submitted', to: 'verified' }] },
  { id: 'au_19', ip: '197.210.44.9', user: 'Ngozi Eze', domain: 'admin', module: 'Onboarding', activity: 'Verified financier Ivory Trust Capital', at: '2026-04-18T14:00:00Z', changes: [{ field: 'onboarding', from: 'submitted', to: 'verified' }] },
  { id: 'au_20', ip: '102.89.34.12', user: 'Ibrahim Suleiman', domain: 'admin', module: 'User Management', activity: 'Created persona Tope Alade (admin initiator)', at: '2026-05-11T10:05:00Z' },
  { id: 'au_21', ip: '41.58.101.4', user: 'Fatima Bello', domain: 'borrower', module: 'Approvals', activity: 'Approved APR-5001 — Add initiator persona Yemi Adewale', at: '2026-06-11T09:40:00Z', changes: [{ field: 'status', from: 'pending', to: 'approved' }] },
  { id: 'au_22', ip: '105.112.20.11', user: 'Kemi Adeyemi', domain: 'financier', module: 'Communities', activity: 'Submitted offer “Cookstove Restock Loan” for approval', at: '2026-06-29T10:45:00Z' },
  { id: 'au_23', ip: '41.58.101.6', user: 'Tamuno Briggs', domain: 'borrower', module: 'Projects', activity: 'Submitted SFMP-PRJ-0019 to the marketplace', at: '2026-05-12T08:30:00Z' },
  { id: 'au_24', ip: '197.210.44.9', user: 'Ngozi Eze', domain: 'admin', module: 'Projects', activity: 'Recommended SFMP-PRJ-0021 to the marketplace', at: '2026-06-12T11:25:00Z', changes: [{ field: 'status', from: 'on_marketplace', to: 'recommended' }] },
  { id: 'au_25', ip: '105.112.20.13', user: 'Bola Lawson', domain: 'financier', module: 'Projects', activity: 'Selected SFMP-PRJ-0022 for funding', at: '2026-06-16T09:55:00Z', changes: [{ field: 'status', from: 'recommended', to: 'selected' }] },
  { id: 'au_26', ip: '41.58.101.3', user: 'Amara Okonkwo', domain: 'borrower', module: 'Messages', activity: 'Sent MSG-4040 to Meridian Capital Partners', at: '2026-07-02T09:10:00Z' },
  { id: 'au_27', ip: '102.89.34.15', user: 'Zainab Aliyu', domain: 'admin', module: 'Approvals', activity: 'Rejected APR-4970 — Update Agriculture document pack', at: '2026-04-25T09:30:00Z', changes: [{ field: 'status', from: 'pending', to: 'rejected' }] },
  { id: 'au_28', ip: '105.112.20.7', user: 'Tunde Bakare', domain: 'financier', module: 'Meetings', activity: 'Scheduled “Warri Port solar — CP checklist review”', at: '2026-06-28T12:20:00Z' },
  { id: 'au_29', ip: '197.210.44.10', user: 'Ibrahim Suleiman', domain: 'admin', module: 'Sectors', activity: 'Drafted warehouse-receipt section for the Agriculture sector', at: '2026-04-24T13:40:00Z' },
  { id: 'au_30', ip: '41.58.101.7', user: 'Edem Bassey', domain: 'borrower', module: 'Projects', activity: 'Submitted SFMP-PRJ-0025 to the marketplace', at: '2026-06-26T15:05:00Z' },
]

/* ----------------------------- notifications ------------------------------ */

export const NOTIFICATIONS: NotificationItem[] = [
  // Borrower
  { id: 'nt_1', audience: 'borrower', category: 'message', title: 'Information requested', body: 'Admin requested more information on SFMP-PRJ-0001.', read: false, time: '2h ago', link: '/borrower/messages' },
  { id: 'nt_2', audience: 'borrower', category: 'project', title: 'Project accepted', body: 'Anchorline Investments accepted SFMP-PRJ-0008 — checklist complete.', read: false, time: '2w ago', link: '/borrower/projects' },
  { id: 'nt_3', audience: 'borrower', category: 'meeting', title: 'Meeting invitation', body: 'Anchorline Investments invited you to “Ibadan North CP confirmation call”.', read: false, time: '5d ago', link: '/borrower/meetings' },
  { id: 'nt_4', audience: 'borrower', audienceSub: 'authorizer', category: 'approval', title: 'Approval pending', body: 'Add analyst persona — Ada Nwankwo is awaiting your review.', read: false, time: '1d ago', link: '/borrower/approvals' },
  { id: 'nt_5', audience: 'borrower', category: 'project', title: 'Project recommended', body: 'SFMP-PRJ-0002 was recommended to financiers.', read: true, time: '5w ago', link: '/borrower/projects' },
  // Financier
  { id: 'nt_6', audience: 'financier', category: 'project', title: 'New recommended project', body: 'Kaduna Textile Mill Solar Retrofit is now on the marketplace.', read: false, time: '1w ago', link: '/financier/marketplace' },
  { id: 'nt_7', audience: 'financier', category: 'project', title: 'Checklist submitted', body: 'Delta Renewables Ltd is progressing CP filings on SFMP-PRJ-0004.', read: false, time: '3d ago', link: '/financier/projects' },
  { id: 'nt_8', audience: 'financier', audienceSub: 'authorizer', category: 'approval', title: 'Approval pending', body: 'Accept SFMP-PRJ-0003 for funding is awaiting your review.', read: false, time: '6d ago', link: '/financier/approvals' },
  { id: 'nt_9', audience: 'financier', category: 'message', title: 'New message', body: 'SFMP · Sterling Bank: New recommendation — Kaduna Textile Mill Solar Retrofit.', read: true, time: '1w ago', link: '/financier/messages' },
  // Admin
  { id: 'nt_10', audience: 'admin', audienceSub: 'authorizer', category: 'approval', title: 'Approvals pending', body: 'A sector change and a recommendation are awaiting your review.', read: false, time: '4d ago', link: '/admin/approvals' },
  { id: 'nt_11', audience: 'admin', category: 'project', title: 'New submissions', body: 'GreenVolt Microgrids and Kano AgroEnergy submitted new projects.', read: false, time: '5d ago', link: '/admin/projects' },
  { id: 'nt_12', audience: 'admin', category: 'onboarding', title: 'Onboarding review due', body: 'Sahel Solar Ltd and Kano AgroEnergy are awaiting verification.', read: true, time: '1w ago', link: '/admin/borrowers' },
]
