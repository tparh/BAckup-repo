"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Step 1: Perform login authentication
      const loginResponse = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password, role }),
      });

      const loginData = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginData.error || 'Login failed');

      // Step 2: Fetch complete user profile data
      const profileResponse = await fetch(`http://localhost:5000/profile/${loginData.user.email}`);
      const profileData = await profileResponse.json();
      
      // Step 3: Combine and store user data
      const completeUserData = {
        auth: loginData.user,
        profile: profileResponse.ok ? profileData : null
      };
      
      localStorage.setItem('userData', JSON.stringify(completeUserData));

      // Step 4: Handle role-based redirection
      switch(loginData.user.role.toLowerCase()) {
        case 'student':
          router.push('/Student');
          break;
        case 'admin':
          router.push('/Admin');
          break;
        case 'recruiter':
          router.push('/recruiter-dashboard');
          break;
        default:
          router.push('/');
      }

    } catch (err) {
      setError(err.message);
      localStorage.removeItem('userData');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#1a237e] relative">
        <div className="absolute inset-0">
          <img 
            src="https://public.readdy.ai/ai/img_res/098c934fd09244d5ac40a7a16026026f.jpg"
            alt="Placement Illustration"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <img 
            src="https://public.readdy.ai/ai/img_res/f6c3bad74042e3ed3382703d9c6208d1.jpg"
            alt="Logo"
            className="w-32 h-32 mb-8"
          />
          <h1 className="text-4xl font-bold mb-4">Placement Management System</h1>
          <p className="text-xl text-center">Your Gateway to Career Success</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold text-[#1a237e]">Welcome Back</h2>
            <p className="text-gray-600">Please sign in to continue</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <RadioGroup 
              value={role} 
              onValueChange={setRole} 
              className="flex gap-6"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin">Admin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recruiter" id="recruiter" />
                <Label htmlFor="recruiter">Recruiter</Label>
              </div>
            </RadioGroup>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a href="#" className="text-[#1a237e] hover:underline text-sm">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1a237e] hover:bg-[#1a237e]/90 text-white !rounded-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="/SignUp" className="text-[#1a237e] hover:underline font-medium">
              Sign up now
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;