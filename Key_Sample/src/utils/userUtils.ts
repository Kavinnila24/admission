/**
 * Utility functions for user session management
 */

import { getCookie } from "../apis/enum";
import apiConfig from "../config/apiConfig";



/**
 * Logs user session information for debugging
 */
export const logUserSession = (): void => {
  console.log('User Session Info:', {
    userId: getCurrentUserId(),
    userRole: getCurrentUserRole(),
    isAdmin: isCurrentUserAdmin(),
    sessionStorage: {
      applicant_id: sessionStorage.getItem('applicant_id'),
      userId: sessionStorage.getItem('userId'),
      userRole: sessionStorage.getItem('userRole'),
      isAdmin: sessionStorage.getItem('isAdmin'),
    }
  });
};



// Function to fetch user by email using GET_USER_BY_EMAIL decorator
export const fetchUserByEmail = async (email: string) => {
  try {
    const accessToken = getCookie("access_token");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const params = new URLSearchParams();
    params.append('queryId', 'GET_USER_BY_EMAIL');
    params.append('args', `email:${email}`);

    const response = await fetch(
      apiConfig.getResourceUrl("user") + "?" + params.toString(),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      }
    );
    
    if (!response.ok) {
      throw new Error('Error fetching user: ' + response.status);
    }

    const data = await response.json();
    const user = data.resource && data.resource.length > 0 ? data.resource[0] : null;
    
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Function to get current user's actual database ID
export const getCurrentUserDatabaseId = async (): Promise<string | null> => {
  try {
    // Get email from session storage (this should be available after login)
    const userEmail = sessionStorage.getItem('userId'); // This contains the email
    
    if (!userEmail) {
      console.error('User email not found in session storage');
      return null;
    }

    // Fetch user object using the decorator
    const user = await fetchUserByEmail(userEmail);
    
    if (user && user.id) {
      return user.id;
    } else {
      console.error('User object or ID not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting current user database ID:', error);
    return null;
  }
};

// Get current user ID (fallback to what's stored in session)
export const getCurrentUserId = (): string | null => {
  return sessionStorage.getItem('applicant_id');
};

// Get current user role
export const getCurrentUserRole = (): string | null => {
  return sessionStorage.getItem('userRole');
};

// Check if current user is admin
export const isCurrentUserAdmin = (): boolean => {
  return sessionStorage.getItem('isAdmin') === 'true';
};

// Auto-populate form data with current user ID
export const autoPopulateUserId = (existingData: any = {}): any => {
  return {
    ...existingData,
    applicant_id: getCurrentUserId() || '',
  };
};