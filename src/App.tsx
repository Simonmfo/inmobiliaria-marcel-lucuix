import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ShowroomView from "./components/ShowroomView";
import InventoryView from "./components/InventoryView";
import AdminDashboardView from "./components/AdminDashboardView";
import AddVehicleView from "./components/AddVehicleView";
import LoginView from "./components/LoginView";

import { Vehicle, Inquiry, ServiceAppointment } from "./types";
import { INITIAL_VEHICLES, DEFAULT_INQUIRIES, UPCOMING_SERVICES } from "./data";
import { supabase } from "./lib/supabase";
import { parsePath, buildPath, ViewType } from "./lib/router";

export default function App() {
  // Parse initial route from browser URL
  const initialRoute = parsePath(window.location.pathname);

  // Global State Engine
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(() => {
    if (initialRoute.vehicleId) {
      const found = INITIAL_VEHICLES.find(v => v.id === initialRoute.vehicleId);
      if (found) return found;
    }
    return INITIAL_VEHICLES[0];
  });
  const [targetVehicleId, setTargetVehicleId] = useState<string | undefined>(initialRoute.vehicleId);

  const [inquiries, setInquiries] = useState<Inquiry[]>(DEFAULT_INQUIRIES);
  const [serviceAppointments, setServiceAppointments] = useState<ServiceAppointment[]>(UPCOMING_SERVICES);
  
  // Navigation Routing States
  const [currentView, setCurrentView] = useState<ViewType>(initialRoute.view);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("carseller_auth") === "true";
  });

  // Handle Auth changes with persistent storage
  const handleSetAuthenticated = (val: boolean) => {
    setIsAuthenticated(val);
    if (val) {
      localStorage.setItem("carseller_auth", "true");
    } else {
      localStorage.removeItem("carseller_auth");
    }
  };

  // URL Slug Navigation Helper
  const navigateTo = (view: ViewType, vehicleId?: string) => {
    setCurrentView(view);
    setTargetVehicleId(vehicleId);
    const newPath = buildPath(view, vehicleId);
    if (window.location.pathname !== newPath) {
      window.history.pushState({ view, vehicleId }, "", newPath);
    }
  };

  // Close vehicle detail modal
  const handleCloseVehicleDetail = () => {
    setTargetVehicleId(undefined);
    navigateTo("showroom", undefined);
  };

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const route = parsePath(window.location.pathname);
      setCurrentView(route.view);
      setTargetVehicleId(route.vehicleId);
      if (route.vehicleId) {
        const match = vehicles.find(v => v.id === route.vehicleId);
        if (match) setSelectedVehicle(match);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [vehicles]);

  // Sync targetVehicleId when vehicles data changes
  useEffect(() => {
    if (targetVehicleId && vehicles.length > 0) {
      const match = vehicles.find(v => v.id === targetVehicleId);
      if (match) {
        setSelectedVehicle(match);
      }
    }
  }, [targetVehicleId, vehicles]);

  // Sync state with Supabase cloud database
  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        const { data: dbVehicles, error: vError } = await supabase
          .from("vehicles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!vError && dbVehicles && dbVehicles.length > 0) {
          const validProperties = (dbVehicles as Vehicle[]).filter(
            (v) => v.propertyType || (v.image && v.image.startsWith("/properties/"))
          );
          if (validProperties.length > 0) {
            const merged = validProperties.map((dbItem) => {
              const localMatch = INITIAL_VEHICLES.find((init) => init.id === dbItem.id);
              return localMatch
                ? { ...dbItem, image: localMatch.image, gallery: localMatch.gallery }
                : dbItem;
            });
            setVehicles(merged);
            if (targetVehicleId) {
              const match = merged.find((v) => v.id === targetVehicleId);
              if (match) setSelectedVehicle(match);
            }
          }
        }

        const { data: dbInquiries, error: iError } = await supabase
          .from("inquiries")
          .select("*")
          .order("created_at", { ascending: false });

        if (!iError && dbInquiries && dbInquiries.length > 0) {
          setInquiries(dbInquiries as Inquiry[]);
        }
      } catch (err) {
        console.warn("Supabase initial fetch fallback to local data:", err);
      }
    }

    fetchSupabaseData();
  }, [targetVehicleId]);

  // Operations handlers
  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setTargetVehicleId(vehicle.id);
    navigateTo("showroom", vehicle.id);
  };

  const handleSetView = (view: ViewType) => {
    if (view === "showroom") {
      setTargetVehicleId(undefined);
      navigateTo("showroom", undefined);
    } else {
      navigateTo(view);
    }
  };

  const handleAddVehicle = async (newVehicle: Vehicle) => {
    setVehicles(prev => [newVehicle, ...prev]);
    setSelectedVehicle(newVehicle);
    try {
      await supabase.from("vehicles").insert([newVehicle]);
    } catch (e) {
      console.error("Error inserting vehicle into Supabase:", e);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    setVehicles(prev => {
      const updated = prev.filter(v => v.id !== id);
      if (selectedVehicle.id === id && updated.length > 0) {
        setSelectedVehicle(updated[0]);
      }
      return updated;
    });
    try {
      await supabase.from("vehicles").delete().eq("id", id);
    } catch (e) {
      console.error("Error deleting vehicle from Supabase:", e);
    }
  };

  const handleChangeVehicleStatus = async (id: string, status: Vehicle["status"]) => {
    setVehicles(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, status } : v);
      if (status === 'Hidden' && selectedVehicle.id === id) {
        const nextActive = updated.find(v => v.status !== 'Hidden');
        if (nextActive) setSelectedVehicle(nextActive);
      }
      return updated;
    });
    try {
      const { error } = await supabase.from("vehicles").update({ status }).eq("id", id);
      if (error) console.error("Error updating status in Supabase:", error);
    } catch (e) {
      console.error("Error updating vehicle status in Supabase:", e);
    }
  };

  const handleAddInquiry = async (newInquiry: Inquiry) => {
    setInquiries(prev => [newInquiry, ...prev]);
    try {
      await supabase.from("inquiries").insert([newInquiry]);
    } catch (e) {
      console.error("Error saving inquiry into Supabase:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-brand-600 selection:text-white font-sans overflow-x-hidden antialiased">
      
      {/* Universal Top Header */}
      <Header 
        currentView={currentView} 
        setView={handleSetView} 
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={handleSetAuthenticated}
        totalVehicles={vehicles.filter(v => v.status !== "Sold").length}
      />

      {/* Interactive Main Workspace Content Area */}
      <main className="flex-grow w-full">
        <AnimatePresence mode="wait">
          {currentView === "showroom" && (
            <motion.div 
              key="showroom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ShowroomView 
                vehicle={selectedVehicle}
                targetVehicleId={targetVehicleId}
                allVehicles={vehicles}
                onSelectVehicle={handleSelectVehicle}
                onCloseVehicleDetail={handleCloseVehicleDetail}
                onAddInquiry={handleAddInquiry}
                setView={handleSetView}
              />
            </motion.div>
          )}

          {currentView === "inventory" && (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <InventoryView 
                vehicles={vehicles}
                onSelectVehicle={handleSelectVehicle}
                setView={handleSetView}
              />
            </motion.div>
          )}

          {currentView === "admin" && (
            isAuthenticated ? (
              <motion.div 
                key="admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AdminDashboardView 
                  vehicles={vehicles}
                  inquiries={inquiries}
                  serviceAppointments={serviceAppointments}
                  onDeleteVehicle={handleDeleteVehicle}
                  onChangeVehicleStatus={handleChangeVehicleStatus}
                  onSelectVehicle={handleSelectVehicle}
                  setView={handleSetView}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="login-redirect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LoginView
                  onLogin={() => {
                    handleSetAuthenticated(true);
                    navigateTo("admin");
                  }}
                  setView={handleSetView}
                />
              </motion.div>
            )
          )}

          {currentView === "add-vehicle" && (
            isAuthenticated ? (
              <motion.div 
                key="add-vehicle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AddVehicleView 
                  onAddVehicle={handleAddVehicle}
                  setView={handleSetView}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="login-redirect-add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LoginView
                  onLogin={() => {
                    handleSetAuthenticated(true);
                    navigateTo("add-vehicle");
                  }}
                  setView={handleSetView}
                />
              </motion.div>
            )
          )}

          {currentView === "login" && (
            <motion.div 
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoginView
                onLogin={() => {
                  handleSetAuthenticated(true);
                  navigateTo("admin");
                }}
                setView={handleSetView}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Universal Footer */}
      <Footer setView={handleSetView} />

    </div>
  );
}
