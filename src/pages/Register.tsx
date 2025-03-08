import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserPlus, 
  Sparkles,
  Mail, 
  Lock, 
  User, 
  Calendar, 
  BookOpen,
  Loader2,
  Rocket,
  Target,
  Brain
} from 'lucide-react';

const EDUCATION_LEVELS = [
  'High School',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Other',
];

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    age: '',
    educationLevel: '',
    currentEducation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (parseInt(formData.age) < 13) {
      return setError('You must be at least 13 years old to register');
    }

    try {
      setError('');
      setLoading(true);
      
      const userData = {
        username: formData.username,
        full_name: formData.fullName,
        age: parseInt(formData.age),
        education_level: formData.educationLevel,
        current_education: formData.currentEducation,
      };

      await signUp(formData.email, formData.password, userData);
      navigate('/career-selection');
    } catch (err: any) {
      if (err.message === 'User already registered') {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (err.message?.toLowerCase().includes('password')) {
        setError('Password must be at least 6 characters long.');
      } else if (err.message?.toLowerCase().includes('email')) {
        setError('Please enter a valid email address.');
      } else if (err.message?.includes('duplicate key')) {
        setError('Username already taken. Please choose a different username.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
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
            Begin Your Journey
          </h1>
          <p className="text-xl text-black">
            Join our community of achievers
          </p>
          
          <div className="grid gap-6 mt-8">
            <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0 mt-1">
                <Target className="h-6 w-6 text-blue" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-blue">Career Discovery</h3>
                <p className="text-black">Find your perfect career path with AI guidance</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0 mt-1">
                <Brain className="h-6 w-6 text-blue" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-blue">Smart Learning</h3>
                <p className="text-black">Personalized learning paths just for you</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0 mt-1">
                <Rocket className="h-6 w-6 text-blue" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-blue">Skill Growth</h3>
                <p className="text-black">Build essential skills for your future</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in border-2 border-blue">
            <div className="text-center mb-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-blue">Create Account</h2>
              <p className="mt-2 text-sm text-black">
                Start your career exploration journey
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-blue">
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2.5 bg-white border-2 border-blue rounded-lg text-black focus:ring-2 focus:ring-blue transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-blue">
                    Username
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2.5 bg-white border-2 border-blue rounded-lg text-black focus:ring-2 focus:ring-blue transition-all duration-200"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-blue">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2.5 bg-white border-2 border-blue rounded-lg text-black focus:ring-2 focus:ring-blue transition-all duration-200"
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2.5 bg-white border-2 border-blue rounded-lg text-black focus:ring-2 focus:ring-blue transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-blue">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2.5 bg-white border-2 border-blue rounded-lg text-black focus:ring-2 focus:ring-blue transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label htmlFor="age" className="block text-sm font-medium text-blue">
                    Age
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue" />
                    <input
                      id="age"
                      name="age"
                      type="number"
                      required
                      min="13"
                      value={formData.age}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2.5 bg-white border-2 border-blue rounded-lg text-black focus:ring-2 focus:ring-blue transition-all duration-200"
                      placeholder="Enter your age"
                    />
                  </div>
                </div>

                {/* Education Level */}
                <div className="space-y-2">
                  <label htmlFor="educationLevel" className="block text-sm font-medium text-blue">
                    Education Level
                  </label>
                  <div className="relative group">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue" />
                    <select
                      id="educationLevel"
                      name="educationLevel"
                      required
                      value={formData.educationLevel}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2.5 bg-white border-2 border-blue rounded-lg text-black focus:ring-2 focus:ring-blue transition-all duration-200"
                    >
                      <option value="">Select level</option>
                      {EDUCATION_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Current Education */}
                <div className="space-y-2">
                  <label htmlFor="currentEducation" className="block text-sm font-medium text-blue">
                    Currently Pursuing (Optional)
                  </label>
                  <div className="relative group">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue" />
                    <input
                      id="currentEducation"
                      name="currentEducation"
                      type="text"
                      value={formData.currentEducation}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2.5 bg-white border-2 border-blue rounded-lg text-black focus:ring-2 focus:ring-blue transition-all duration-200"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
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
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <span className="text-sm text-black">Already have an account? </span>
              <Link 
                to="/login" 
                className="text-sm font-semibold text-[#00308F] hover:text-[#001F5C]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}