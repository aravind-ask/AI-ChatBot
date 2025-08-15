import React, { useState } from "react";
import { useSignInEmailPassword, useSignUpEmailPassword } from "@nhost/react";
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle, BotMessageSquare } from "lucide-react";

// Helper function to get user-friendly error messages
const getErrorMessage = (error: any) => {
  if (!error?.message) return "An unexpected error occurred";
  
  const message = error.message.toLowerCase();
  
  if (message.includes('user-already-exists') || message.includes('email-already-in-use')) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (message.includes('invalid-email')) {
    return "Please enter a valid email address.";
  }
  if (message.includes('invalid-password') || message.includes('incorrect-password')) {
    return "Incorrect password. Please try again.";
  }
  if (message.includes('user-not-found') || message.includes('invalid-credentials')) {
    return "No account found with this email address.";
  }
  if (message.includes('email-not-verified')) {
    return "Please verify your email address before signing in.";
  }
  if (message.includes('too-many-requests')) {
    return "Too many attempts. Please wait a moment before trying again.";
  }
  if (message.includes('weak-password')) {
    return "Password is too weak. Please choose a stronger password.";
  }
  if (message.includes('network')) {
    return "Network error. Please check your connection and try again.";
  }
  
  // Return the original message if no specific match found
  return error.message;
};

interface AuthFormProps {
  mode: "signin" | "signup";
  onToggleMode: () => void;
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const {
    signInEmailPassword,
    isLoading: signInLoading,
    error: signInError,
  } = useSignInEmailPassword();
  const {
    signUpEmailPassword,
    isLoading: signUpLoading,
    error: signUpError,
  } = useSignUpEmailPassword();

  const isLoading = signInLoading || signUpLoading;
  const error = signInError || signUpError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signin") {
      await signInEmailPassword(email, password);
    } else {
      const result = await signUpEmailPassword(email, password, {
        displayName: `${firstName} ${lastName}`.trim(),
        metadata: {
          firstName,
          lastName,
        },
      });
      
      // After successful registration, show verification message or toggle to login
      if (!result.error) {
        if (result.needsEmailVerification) {
          // Show email verification message
          setVerificationEmail(email);
          setShowVerificationMessage(true);
          // Clear form fields
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
        } else {
          // Clear form fields
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          
          // Toggle to login form
          onToggleMode();
        }
      }
    }
  };

  // If showing verification message, render that instead
  if (showVerificationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                We've sent a verification link to your email address
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    Verification email sent to:
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700 font-mono bg-blue-100 px-2 py-1 rounded break-all">
                    {verificationEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-xs">1</span>
                </div>
                <p>Check your email inbox (and spam folder)</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-xs">2</span>
                </div>
                <p>Click the verification link in the email</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-xs">3</span>
                </div>
                <p>Return here and sign in with your credentials</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => {
                  setShowVerificationMessage(false);
                  onToggleMode();
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              >
                Continue to Sign In
              </button>
              <button
                onClick={() => setShowVerificationMessage(false)}
                className="w-full text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Back to Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <BotMessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {mode === "signin" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {mode === "signin"
                ? "Sign in to your account to continue"
                : "Get started with your new account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "signup" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      {getErrorMessage(error)}
                    </p>
                    {error.message.toLowerCase().includes('email-not-verified') && (
                      <p className="text-xs mt-1">
                        Please check your email and click the verification link before signing in.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {mode === "signin" ? "Signing In..." : "Creating Account..."}
                </div>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={onToggleMode}
              className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {mode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}