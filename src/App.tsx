import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";

function AppContent() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function App() {
  return <AppContent />;
}

export default App;
