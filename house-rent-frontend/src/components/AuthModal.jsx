import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authAPI, usersAPI, agentsAPI, authUtils } from '../services/api'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { X, Eye, EyeOff, User, UserCheck } from 'lucide-react'

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('signin')
  const [userType, setUserType] = useState('user') // 'user' or 'agent'

  // Form states
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  })

  const [signUpData, setSignUpData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    // Agent specific fields
    license_number: '',
    years_experience: ''
  })

  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      let response
      if (userType === 'user') {
        response = await authAPI.loginUser(signInData.email, signInData.password)
      } else {
        response = await authAPI.loginAgent(signInData.email, signInData.password)
      }

      // Store token
      authUtils.setToken(response.access_token)

      // Fetch user data after login since login only returns token
      let userData
      try {
        if (userType === 'user') {
          userData = await usersAPI.getUserProfile()
        } else {
          userData = await agentsAPI.getAgentProfile()
        }

        // Store user data
        authUtils.setUserData(userData, userType)

        // Call success callback
        if (onAuthSuccess) {
          onAuthSuccess(userData, userType)
        }

        // Close modal
        onClose()
      } catch (profileError) {
        console.error('Failed to fetch user profile:', profileError)
        setError('Login successful but failed to load profile. Please try again.')
        authUtils.removeToken()
      }
    } catch (error) {
      setError(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate passwords match
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const userDataForRegistration = {
        email: signUpData.email,
        username: signUpData.username,
        password: signUpData.password,
        full_name: signUpData.full_name,
        phone: signUpData.phone
      }

      // Add agent-specific fields if registering as agent
      if (userType === 'agent') {
        userDataForRegistration.license_number = signUpData.license_number
        userDataForRegistration.years_experience = parseInt(signUpData.years_experience) || 0
      }

      let response
      if (userType === 'user') {
        response = await authAPI.registerUser(userDataForRegistration)
      } else {
        response = await authAPI.registerAgent(userDataForRegistration)
      }

      // Auto-login after successful registration
      const loginResponse = userType === 'user' 
        ? await authAPI.loginUser(signUpData.email, signUpData.password)
        : await authAPI.loginAgent(signUpData.email, signUpData.password)

      // Store token
      authUtils.setToken(loginResponse.access_token)

      // Fetch user data after login since login only returns token
      let userData
      if (userType === 'user') {
        userData = await usersAPI.getUserProfile()
      } else {
        userData = await agentsAPI.getAgentProfile()
      }

      // Store user data
      authUtils.setUserData(userData, userType)

      // Call success callback
      if (onAuthSuccess) {
        onAuthSuccess(userData, userType)
      }

      // Close modal
      onClose()
    } catch (error) {
      setError(error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSignInData({ email: '', password: '' })
    setSignUpData({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      phone: '',
      license_number: '',
      years_experience: ''
    })
    setError('')
    setShowPassword(false)
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
    resetForm()
  }

  const handleUserTypeChange = (type) => {
    setUserType(type)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
          <CardTitle className="text-2xl text-center">Welcome to RentEase</CardTitle>
          
          {/* User Type Selection */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={userType === 'user' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleUserTypeChange('user')}
              className="flex-1"
            >
              <User className="h-4 w-4 mr-2" />
              Renter
            </Button>
            <Button
              variant={userType === 'agent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleUserTypeChange('agent')}
              className="flex-1"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Agent
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : `Sign In as ${userType === 'user' ? 'Renter' : 'Agent'}`}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-full-name">Full Name</Label>
                    <Input
                      id="signup-full-name"
                      value={signUpData.full_name}
                      onChange={(e) => setSignUpData({ ...signUpData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      value={signUpData.username}
                      onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signup-phone">Phone</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    required
                  />
                </div>

                {userType === 'agent' && (
                  <>
                    <div>
                      <Label htmlFor="signup-license">License Number</Label>
                      <Input
                        id="signup-license"
                        value={signUpData.license_number}
                        onChange={(e) => setSignUpData({ ...signUpData, license_number: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-experience">Years of Experience</Label>
                      <Input
                        id="signup-experience"
                        type="number"
                        min="0"
                        value={signUpData.years_experience}
                        onChange={(e) => setSignUpData({ ...signUpData, years_experience: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : `Sign Up as ${userType === 'user' ? 'Renter' : 'Agent'}`}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthModal
