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

function syncWithInitialImages(items: Vehicle[]): Vehicle[] {
  return items.map(item => {
    const localMatch = INITIAL_VEHICLES.find(init => init.id === item.id);
    if (localMatch) {
      return {
        ...item,
        image: localMatch.image,
        gallery: localMatch.gallery
      };
    }
    return item;
  });
}

export default function App() {
  // Parse initial route from browser URL
  const initialRoute = parsePath(window.location.pathname);

  // Global State Engine with LocalStorage persistence fallback
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem("marcellucuix_properties");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return syncWithInitialImages(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load properties from localStorage:", e);
    }
    return INITIAL_VEHICLES;
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(() => {
    if (initialRoute.vehicleId) {
      const found = INITIAL_VEHICLES.find(v => v.id === initialRoute.vehicleId);
      if (found) return found;
    }
    return INITIAL_VEHICLES[0];
  });
  const [targetVehicleId, setTargetVehicleId] = useState<string | undefined>(initialRoute.vehicleId);

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const savedInq = localStorage.getItem("marcellucuix_inquiries");
      if (savedInq) {
        const parsed = JSON.parse(savedInq);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return DEFAULT_INQUIRIES;
  });
  const [serviceAppointments] = useState<ServiceAppointment[]>(UPCOMING_SERVICES);
  
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

  // Save properties to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("marcellucuix_properties", JSON.stringify(vehicles));
    } catch (e) {
      console.warn("Could not save properties to localStorage:", e);
    }
  }, [vehicles]);

  // Save inquiries to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("marcellucuix_inquiries", JSON.stringify(inquiries));
    } catch (e) {}
  }, [inquiries]);

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
            const merged = syncWithInitialImages(validProperties);
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
    setVehicles(prev => {
      const updated = [newVehicle, ...prev];
      try {
        localStorage.setItem("marcellucuix_properties", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setSelectedVehicle(newVehicle);
    try {
      await supabase.from("vehicles").insert([newVehicle]);
    } catch (e) {
      console.warn("Supabase insert not available, saved locally:", e);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    setVehicles(prev => {
      const updated = prev.filter(v => v.id !== id);
      if (selectedVehicle.id === id && updated.length > 0) {
        setSelectedVehicle(updated[0]);
      }
      try {
        localStorage.setItem("marcellucuix_properties", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    try {
      await supabase.from("vehicles").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase delete not available, deleted locally:", e);
    }
  };

  const handleChangeVehicleStatus = async (id: string, status: Vehicle["status"]) => {
    setVehicles(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, status } : v);
      if (status === 'Hidden' && selectedVehicle.id === id) {
        const nextActive = updated.find(v => v.status !== 'Hidden');
        if (nextActive) setSelectedVehicle(nextActive);
      }
      try {
        localStorage.setItem("marcellucuix_properties", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    try {
      const { error } = await supabase.from("vehicles").update({ status }).eq("id", id);
      if (error) console.warn("Supabase update error:", error);
    } catch (e) {
      console.warn("Supabase update status not available, updated locally:", e);
    }
  };

  const handleAddInquiry = async (newInquiry: Inquiry) => {
    setInquiries(prev => {
      const updated = [newInquiry, ...prev];
      try {
        localStorage.setItem("marcellucuix_inquiries", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
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
        totalVehicles={vehicles.filter(v => v.status !== "Sold" && v.status !== "Hidden").length}
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
