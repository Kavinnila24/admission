// Utility function to handle API responses and check for 403 errors
export const handleApiResponse = async (response: Response, navigate: (path: string) => void) => {
  if (response.status === 403) {
    // Redirect to 403 page on unauthorized access
    navigate('/forbidden');
    return null;
  }
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response;
};

// Enhanced fetch wrapper that automatically handles 403 responses
export const fetchWithAuthCheck = async (
  url: string, 
  options: RequestInit = {}, 
  navigate: (path: string) => void
) => {
  try {
    const response = await fetch(url, options);
    const checkedResponse = await handleApiResponse(response, navigate);
    return checkedResponse;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Hook for role-based access control
export const useRoleBasedAccess = () => {
  const userRole = sessionStorage.getItem('userRole') || 'USER';
  const isAdmin = userRole === 'ADMIN';
  
  const checkAccess = (requiredRole: string) => {
    return userRole === requiredRole;
  };
  
  return { userRole, isAdmin, checkAccess };
};
