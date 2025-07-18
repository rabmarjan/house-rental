// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || 'API request failed');
  }
  return response.json();
};
// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Authentication API
export const authAPI = {
  // User login
  loginUser: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email,
        password: password
      })
    });
    return handleResponse(response);
  },

  // Agent login
  loginAgent: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/agent/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email,
        password: password
      })
    });
    return handleResponse(response);
  },

  // Register user
  registerUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Register agent
  registerAgent: async (agentData) => {
    const response = await fetch(`${API_BASE_URL}/agents/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData)
    });
    return handleResponse(response);
  }
};

// Houses API
export const housesAPI = {
  // Get all houses
  getHouses: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const url = `${API_BASE_URL}/houses/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Search houses
  searchHouses: async (searchParams) => {
    const queryParams = new URLSearchParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== undefined && searchParams[key] !== null && searchParams[key] !== '') {
        queryParams.append(key, searchParams[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/houses/search?${queryParams.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get house by ID
  getHouse: async (houseId) => {
    const response = await fetch(`${API_BASE_URL}/houses/${houseId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get houses by agent ID
  getHousesByAgent: async (agentId) => {
    const response = await fetch(`${API_BASE_URL}/houses/agent/${agentId}`, {
    //  headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Create house (for agents)
  createHouse: async (houseData) => {
    const response = await fetch(`${API_BASE_URL}/houses/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(houseData)
    });
    return handleResponse(response);
  },

  // Update house (for agents)
  updateHouse: async (houseId, houseData) => {
    const response = await fetch(`${API_BASE_URL}/houses/${houseId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(houseData)
    });
    return handleResponse(response);
  },

  // Delete house (for agents)
  deleteHouse: async (houseId) => {
    const response = await fetch(`${API_BASE_URL}/houses/${houseId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Agents API
export const agentsAPI = {
  // Get all agents
  getAgents: async () => {
    const response = await fetch(`${API_BASE_URL}/agents/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get agent by ID
  getAgent: async (agentId) => {
    const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get current agent profile
  getAgentProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/agents/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update agent profile
  updateAgentProfile: async (agentData) => {
    const response = await fetch(`${API_BASE_URL}/agents/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(agentData)
    });
    return handleResponse(response);
  }
};

// Agent Stats API
export const agentStatsAPI = {
  // Get agent stats by agent ID
  getAgentStats: async (agentId) => {
    const response = await fetch(`${API_BASE_URL}/agent-stats/${agentId}`, {
    //  headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  createAgentStats: async (agentStatsData) => {
    const response = await fetch(`${API_BASE_URL}/agent-stats/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(agentStatsData)
    });
    return handleResponse(response);
  },
  updateAgentStats: async (agentId, agentStatsData) => {
    const response = await fetch(`${API_BASE_URL}/agent-stats/${agentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(agentStatsData)
    });
    return handleResponse(response);
  },
  deleteAgentStats: async (agentId) => {
    const response = await fetch(`${API_BASE_URL}/agent-stats/${agentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  } 
};


// Reviews API
export const reviewsAPI = {
  // Get all reviews
  getReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews/`, { 
     // headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  // Get reviews by house ID
  getReviewsByHouse: async (houseId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/house/${houseId}`, {
     // headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get reviews by agent ID
  getReviewsByAgent: async (agentId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/agent/${agentId}`, {
    //  headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

};

// Users API
export const usersAPI = {
  // Get all users (admin only)
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get user by ID
  getUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get current user profile
  getUserProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  }
};

// Furniture Requests API
export const furnitureAPI = {
  // Get all furniture requests
  getFurnitureRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/furniture-requests/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get user's furniture requests
  getMyFurnitureRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/furniture-requests/my-requests`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get furniture request by ID
  getFurnitureRequest: async (requestId) => {
    const response = await fetch(`${API_BASE_URL}/furniture-requests/${requestId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Create furniture request
  createFurnitureRequest: async (requestData) => {
    const response = await fetch(`${API_BASE_URL}/furniture-requests/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData)
    });
    return handleResponse(response);
  },

  // Update furniture request
  updateFurnitureRequest: async (requestId, requestData) => {
    const response = await fetch(`${API_BASE_URL}/furniture-requests/${requestId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData)
    });
    return handleResponse(response);
  },

  // Delete furniture request
  deleteFurnitureRequest: async (requestId) => {
    const response = await fetch(`${API_BASE_URL}/furniture-requests/${requestId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Auth utilities
export const authUtils = {
  // Store token
  setToken: (token) => {
    localStorage.setItem('access_token', token);
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('access_token');
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_data');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Store user data
  setUserData: (userData, userType) => {
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('user_type', userType);
  },

  // Get user data
  getUserData: () => {
    const userData = localStorage.getItem('user_data');
    if (!userData || userData === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get user type
  getUserType: () => {
    return localStorage.getItem('user_type');
  }
};

export default {
  authAPI,
  housesAPI,
  agentsAPI,
  usersAPI,
  furnitureAPI,
  authUtils
};

