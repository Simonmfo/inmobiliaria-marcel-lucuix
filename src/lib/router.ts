export type ViewType = "showroom" | "inventory" | "admin" | "add-vehicle" | "login";

export interface RouteState {
  view: ViewType;
  vehicleId?: string;
}

export function parsePath(pathname: string): RouteState {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";

  if (
    cleanPath === "/inventario" ||
    cleanPath === "/catalogo" ||
    cleanPath === "/propiedades" ||
    cleanPath === "/inmuebles" ||
    cleanPath === "/alquileres" ||
    cleanPath === "/ventas"
  ) {
    return { view: "inventory" };
  }
  if (cleanPath === "/admin") {
    return { view: "admin" };
  }
  if (
    cleanPath === "/admin/nueva-propiedad" ||
    cleanPath === "/admin/nuevo-vehiculo" ||
    cleanPath === "/admin/nuevo" ||
    cleanPath === "/admin/add"
  ) {
    return { view: "add-vehicle" };
  }
  if (cleanPath === "/login" || cleanPath === "/admin/login") {
    return { view: "login" };
  }
  if (cleanPath.startsWith("/propiedad/")) {
    const vehicleId = cleanPath.replace("/propiedad/", "");
    return { view: "showroom", vehicleId };
  }
  if (cleanPath.startsWith("/inmueble/")) {
    const vehicleId = cleanPath.replace("/inmueble/", "");
    return { view: "showroom", vehicleId };
  }
  if (cleanPath.startsWith("/auto/")) {
    const vehicleId = cleanPath.replace("/auto/", "");
    return { view: "showroom", vehicleId };
  }
  if (cleanPath.startsWith("/vehiculo/")) {
    const vehicleId = cleanPath.replace("/vehiculo/", "");
    return { view: "showroom", vehicleId };
  }
  return { view: "showroom" };
}

export function buildPath(view: ViewType, vehicleId?: string): string {
  switch (view) {
    case "inventory":
      return "/propiedades";
    case "admin":
      return "/admin";
    case "add-vehicle":
      return "/admin/nueva-propiedad";
    case "login":
      return "/login";
    case "showroom":
    default:
      return vehicleId ? "/propiedad/" + vehicleId : "/";
  }
}
