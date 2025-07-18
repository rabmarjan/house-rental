import { createContext, useContext, useState, useEffect } from 'react'
import { authUtils, usersAPI, agentsAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null) // 'user' or 'agent'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authUtils.getToken()
        const storedUserType = authUtils.getUserType()
        const storedUserData = authUtils.getUserData()

        if (token && storedUserType && storedUserData) {
          // Verify token is still valid by fetching current user data
          try {
            let currentUserData
            if (storedUserType === 'user') {
              currentUserData = await usersAPI.getUserProfile()
            } else {
              currentUserData = await agentsAPI.getAgentProfile()
            }
            
            setUser(currentUserData)
            setUserType(storedUserType)
            setIsAuthenticated(true)
          } catch (error) {
            // Token is invalid, clear auth data
            console.error('Token validation failed:', error)
            logout()
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = (userData, type) => {
    setUser(userData)
    setUserType(type)
    setIsAuthenticated(true)
    authUtils.setUserData(userData, type)
  }

  const logout = () => {
    setUser(null)
    setUserType(null)
    setIsAuthenticated(false)
    authUtils.removeToken()
  }

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData)
    authUtils.setUserData(updatedUserData, userType)
  }

  const value = {
    user,
    userType,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    // Helper functions
    isUser: userType === 'user',
    isAgent: userType === 'agent'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

