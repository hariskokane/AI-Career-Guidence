import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LogIn, 
  Sparkles,
  Mail, 
  Lock, 
  Loader2,
  Rocket,
  Target,
  Brain
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* App Info Section */}
        <div className="text-center md:text-left space-y-6 p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-blue mb-4 animate-float">
            <Sparkles className="h-10 w-10 text-blue" />
          </div>
          <h1 className="text-4xl font-bold text-blue">
            Welcome Back! 👋
          </h1>
          <p className="text-xl text-black">
            Your journey to success continues here
          </p>
          
          <div className="grid gap-6 mt-8">
            <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0 mt-1">
                <Target className="h-6 w-6 text-blue" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-blue">Smart Learning</h3>
                <p className="text-black">Personalized paths that adapt to your goals</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0 mt-1">
                <Brain className="h-6 w-6 text-blue" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-blue">AI-Powered Growth</h3>
                <p className="text-black">Advanced insights for your development</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0 mt-1">
                <Rocket className="h-6 w-6 text-blue" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-blue">Career Boost</h3>
                <p className="text-black">Accelerate your professional journey</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in border-2 border-blue">
            <div className="text-center mb-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-blue">Sign In</h2>
              <p className="mt-2 text-sm text-black">
                Continue your amazing journey with us
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-white border-2 border-red-500 rounded-lg animate-scale">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-blue">
                  Email address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 bg-white border-2 border-blue rounded-lg text-black focus:ring-2 focus:ring-blue transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-blue">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 bg-white border-2 border-blue rounded-lg text-black focus:ring-2 focus:ring-blue transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center items-center"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <span className="text-sm text-black">Don't have an account? </span>
              <Link 
                to="/register" 
                className="text-sm font-semibold text-[#00308F] hover:text-[#001F5C]"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}