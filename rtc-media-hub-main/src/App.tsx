import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/MainLayout";
import { ProgramaRouter } from "./components/ProgramaRouter";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { useEffect } from "react";
import { useProgramas } from "@/hooks/useApi";

const queryClient = new QueryClient();

const RouteLogger = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("🛣️  Rota mudou para:", location.pathname);
    console.log("🛣️  Location completo:", location);
  }, [location]);

  return null;
};

const InitialRedirect = () => {
  const lastProgramPath = localStorage.getItem("last_program_path");
  const { data: programas = [], isLoading } = useProgramas();

  if (lastProgramPath) {
    return <Navigate to={lastProgramPath} replace />;
  }

  if (isLoading) {
    return null;
  }

  if (programas.length > 0) {
    const primeiroPrograma = programas[0];
    const slug = primeiroPrograma.nome.toLowerCase().replace(/\s+/g, "-");
    return <Navigate to={`/programa/${slug}`} replace />;
  }

  return <Navigate to="/home" replace />;
};

const App = () => {
  console.log("⚡ App - montado");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteLogger />

          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <InitialRedirect />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Admin />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/programa/:programaSlug"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProgramaRouter />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;