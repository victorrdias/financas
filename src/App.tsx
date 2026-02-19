import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { MonthlyPage } from './pages/MonthlyPage';
import { AvulsasPage } from './pages/AvulsasPage';
import { GraficosPage } from './pages/GraficosPage';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/mensais" element={<MonthlyPage />} />
            <Route path="/avulsas" element={<AvulsasPage />} />
            <Route path="/graficos" element={<GraficosPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
