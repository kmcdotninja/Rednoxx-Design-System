import { Navigate, Route, Routes } from 'react-router-dom'
import { DemoLayout } from './DemoShell'
import { SignInPage } from './pages/SignIn'
import { AnalyticsPage } from './pages/Analytics'
import { OverviewPage, ReportsPage } from './pages/Home'
import { AppointmentsPage, ConsultationsPage, PatientsPage, PrescriptionsPage } from './pages/Clinical'
import { PatientChartPage } from './pages/PatientChart'
import { LabOrdersPage, SurgicalOrdersPage } from './pages/Orders'
import { ClaimsPage, PaymentsPage } from './pages/Finance'
import { SettingsPage, StaffPage } from './pages/Manage'

/** The routed Rednoxx product demo — every sidebar destination is a real page. */
export function DemoApp() {
  return (
    <Routes>
      {/* Full-page auth flow — outside the signed-in shell. */}
      <Route path="sign-in" element={<SignInPage />} />
      <Route element={<DemoLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="patients/:id" element={<PatientChartPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="consultations" element={<ConsultationsPage />} />
        <Route path="prescriptions" element={<PrescriptionsPage />} />
        <Route path="lab-orders" element={<LabOrdersPage />} />
        <Route path="surgical-orders" element={<SurgicalOrdersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="insurance-claims" element={<ClaimsPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>
    </Routes>
  )
}
