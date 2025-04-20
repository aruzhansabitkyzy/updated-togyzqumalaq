import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { MyGameContextProvider } from "./context/GameContext";
import Home from "./pages";
import { Game } from "./pages/game";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DesktopOnlyWrapper from "./components/DesktopWrapper";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DesktopOnlyWrapper>
          <div className="font-mono">
            <MyGameContextProvider>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<Game />} />
              </Routes>
            </MyGameContextProvider>
          </div>
        </DesktopOnlyWrapper>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
