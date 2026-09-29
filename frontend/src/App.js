import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { MrvProvider } from "@/context/MrvContext";
import Layout from "@/components/layout/Layout";
import MrvPage from "@/components/mrv/MrvPage";
import {
  Home, Organisation, DataPage, PcfInventory, PcfCalculation, PcfOutput,
  PcfBoundary, PcfAllocation, PcfLogistics, PcfReport, ValueChain, Cbam, CarbonPassport,
} from "@/pages/CrossModule";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MrvProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/organisation" element={<Organisation />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/pcf/inventory" element={<PcfInventory />} />
              <Route path="/pcf/calculation" element={<PcfCalculation />} />
              <Route path="/pcf/output" element={<PcfOutput />} />
              <Route path="/pcf/boundary" element={<PcfBoundary />} />
              <Route path="/pcf/allocation" element={<PcfAllocation />} />
              <Route path="/pcf/logistics" element={<PcfLogistics />} />
              <Route path="/pcf/report" element={<PcfReport />} />
              <Route path="/value-chain" element={<ValueChain />} />
              <Route path="/cbam" element={<Cbam />} />
              <Route path="/passport" element={<CarbonPassport />} />
              <Route path="/mrv" element={<Navigate to="/mrv/readiness" replace />} />
              <Route path="/mrv/:tab" element={<MrvPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" richColors />
        </MrvProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
