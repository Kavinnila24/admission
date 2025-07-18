import apiConfig from "../config/apiConfig";

export const logout = async () => {
  try {
    // Call backend logout endpoint
    await fetch(apiConfig.getResourceUrl("auth/logout"), {
      method: "POST",
      credentials: "include",
    });

    // Clear session storage
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('admin_id');
    sessionStorage.removeItem('applicant_id');
    sessionStorage.removeItem('submitted_form');

    // Clear all cookies by setting them to expire
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });

    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error("Logout error:", error);
    // Even if backend call fails, clear local storage and redirect
    sessionStorage.clear();
    window.location.href = '/login';
  }
};
