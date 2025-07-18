import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowedUserTypes = ['user', 'agent'],
  redirectTo = '/'
}) => {
  const { isAuthenticated, userType, isLoading } = useAuth()

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // If user is authenticated but doesn't have the right user type
  if (isAuthenticated && !allowedUserTypes.includes(userType)) {
    return <Navigate to={redirectTo} replace />
  }

  // If authentication is not required but user is authenticated, 
  // and we want to redirect authenticated users (like login page)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute

