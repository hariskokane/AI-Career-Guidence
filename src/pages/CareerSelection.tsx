import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Notebook as Robot, List, ArrowRight, Brain, Briefcase, ChevronRight } from 'lucide-react';
import CareerChatbot from '../components/CareerChatbot';

interface DatabaseError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}

export default function CareerSelection() {
  const [mode, setMode] = useState<'ai' | 'manual' | null>(null);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasExistingSelection, setHasExistingSelection] = useState(false);
  const [profile, setProfile] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Check existing selection
        const { data, error } = await supabase
          .from('career_selections')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setHasExistingSelection(!!data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please refresh the page.');
      }
    };

    fetchUserData();
  }, [user]);

  const handleCareerSelect = (career: string) => {
    if (hasExistingSelection) return;
    
    setSelectedCareers(prev => {
      if (prev.includes(career)) {
        return prev.filter(c => c !== career);
      }
      if (prev.length >= 2) {
        return [...prev.slice(1), career];
      }
      return [...prev, career];
    });
  };

  const handleSubmit = async (careers?: string[]) => {
    if (!user) {
      setError('Please sign in to save your career selections');
      return;
    }

    const careersToSave = careers || selectedCareers;

    if (careersToSave.length !== 2) {
      setError('Please select exactly two career paths');
      return;
    }

    if (hasExistingSelection) {
      setError('You have already selected your career paths. Please contact support to modify your selection.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // First verify the profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error(profileError.message || 'Failed to verify user profile');
      }

      if (!profileData) {
        throw new Error('Please complete your profile before selecting careers');
      }

      // Then insert career selections
      const { error: dbError } = await supabase
        .from('career_selections')
        .insert({
          user_id: user.id,
          career_path_1: careersToSave[0],
          career_path_2: careersToSave[1],
          selection_mode: mode
        });

      if (dbError) {
        const error = dbError as DatabaseError;
        
        if (error.code === '23505') {
          throw new Error('You have already selected your career paths');
        } else if (error.code === '23503') {
          throw new Error('Please complete your profile before selecting careers');
        } else {
          throw new Error(error.message || 'Failed to save career selections');
        }
      }

      navigate('/dashboard');
    } catch (err) {
      const error = err as Error;
      console.error('Career selection error:', error);
      setError(error.message || 'Failed to save career selections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mode) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Path</h1>
            <p className="mt-2 text-gray-600">
              Select how you'd like to explore your career options
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setMode('ai')}
              className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="flex items-center justify-between">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Robot className="h-8 w-8 text-indigo-600" />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">AI-Guided Selection</h2>
              <p className="mt-2 text-gray-600">
                Let our AI guide you through questions to discover your ideal career paths
              </p>
            </button>

            <button
              onClick={() => setMode('manual')}
              className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="flex items-center justify-between">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <List className="h-8 w-8 text-indigo-600" />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Manual Selection</h2>
              <p className="mt-2 text-gray-600">
                Browse and choose from our curated list of career paths
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'ai' && profile) {
    return (
      <div className="min-h-[80vh] p-4">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <CareerChatbot
            username={profile.username}
            onCareersSelected={(careers) => handleSubmit(careers)}
          />

          <button
            onClick={() => setMode(null)}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Change Selection Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Select Your Career Paths</h2>
          </div>

          <p className="text-gray-600 mb-6">
            Choose exactly two career paths that interest you the most. Your selections will help us
            create a personalized learning journey.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {Object.entries(CAREER_CATEGORIES).map(([category, careers]) => (
              <div key={category} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {careers.map(career => (
                    <button
                      key={career}
                      onClick={() => handleCareerSelect(career)}
                      disabled={hasExistingSelection}
                      className={`p-3 rounded-lg text-left transition-all duration-200 ${
                        selectedCareers.includes(career)
                          ? 'bg-indigo-100 border-2 border-indigo-500'
                          : 'bg-gray-50 border-2 border-transparent hover:border-indigo-300'
                      } ${hasExistingSelection ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="block font-medium text-gray-900">{career}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setMode(null)}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Change Selection Mode
            </button>
            <button
              onClick={() => handleSubmit()}
              disabled={selectedCareers.length !== 2 || loading || hasExistingSelection}
              className="flex items-center px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CAREER_CATEGORIES = {
  'Technology & Engineering': ['Software Engineer', 'Cybersecurity Analyst', 'Data Scientist'],
  'Finance & Business': ['Financial Analyst', 'Investment Banker', 'Business Consultant'],
  'Healthcare & Medicine': ['Doctor', 'Medical Lab Technician', 'Nurse'],
  'Creative Careers': ['Graphic Designer', 'UX/UI Designer', 'Animator']
};