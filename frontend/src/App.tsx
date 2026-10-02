import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/authContext';
import { ScenarioProvider } from './store/scenarioContext';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { ObservabilityPage } from './pages/ObservabilityPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { RCADetailPage } from './pages/RCADetailPage';
import { SecurityPage } from './pages/SecurityPage';
import { CostPage } from './pages/CostPage';
import { CopilotPage } from './pages/CopilotPage';
import { RemediationPage } from './pages/RemediationPage';
import { EventsPage } from './pages/EventsPage';
import { AlertsPage } from './pages/AlertsPage';
import { InterviewGuidePage } from './pages/InterviewGuidePage';
import { LoginPage } from './pages/LoginPage';

export function App() {
  return (
    <AuthProvider>
      <ScenarioProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Platform Dashboard Layout */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<OverviewPage />} />
              <Route path="/infrastructure" element={<InfrastructurePage />} />
              <Route path="/digital-twin" element={<DigitalTwinPage />} />
              <Route path="/observability" element={<ObservabilityPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/rca" element={<RCADetailPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/cost" element={<CostPage />} />
              <Route path="/copilot" element={<CopilotPage />} />
              <Route path="/remediation" element={<RemediationPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/interview-guide" element={<InterviewGuidePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ScenarioProvider>
    </AuthProvider>
  );
}

export default App;
