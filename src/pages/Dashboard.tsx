import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import CareerInsights from '../components/CareerInsights';
import LearningModule from '../components/LearningModule';
import {
  BookOpen,
  Trophy,
  BarChart3,
  GraduationCap,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Brain,
} from 'lucide-react';

interface CareerSelection {
  career_path_1: string;
  career_path_2: string;
  selection_mode: 'ai' | 'manual';
}

interface TestResult {
  career_path: string;
  score: number;
  created_at: string;
}

interface LearningProgress {
  career_path: string;
  module_name: string;
  completion_status: boolean;
}

interface UserProfile {
  username: string;
  full_name: string;
  education_level: string;
}

export default function Dashboard() {
  const [careerSelection, setCareerSelection] = useState<CareerSelection | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, full_name, education_level')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }
        setProfile(profileData);

        // Fetch career selections
        const { data: careerData, error: careerError } = await supabase
          .from('career_selections')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (careerError) {
          throw careerError;
        }
        setCareerSelection(careerData);

        // Only fetch test results and learning progress if career paths are selected
        if (careerData) {
          // Fetch test results
          const { data: testData, error: testError } = await supabase
            .from('mock_test_results')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (testError) throw testError;
          setTestResults(testData || []);

          // Fetch learning progress
          const { data: progressData, error: progressError } = await supabase
            .from('learning_progress')
            .select('*')
            .eq('user_id', user.id);

          if (progressError) throw progressError;
          setLearningProgress(progressData || []);
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const getCareerProgress = (careerPath: string) => {
    const careerModules = learningProgress.filter(p => p.career_path === careerPath);
    const completedModules = careerModules.filter(m => m.completion_status).length;
    return careerModules.length > 0
      ? Math.round((completedModules / careerModules.length) * 100)
      : 0;
  };

  const getLatestTestScore = (careerPath: string) => {
    const careerTests = testResults.filter(t => t.career_path === careerPath);
    return careerTests.length > 0 ? careerTests[0].score : null;
  };

  const getTestLevel = (score: number): 'beginner' | 'intermediate' | 'advanced' => {
    if (score <= 60) return 'beginner';
    if (score <= 80) return 'intermediate';
    return 'advanced';
  };

  const getCareerLevel = (careerPath: string) => {
    const careerTests = testResults.filter(t => t.career_path === careerPath);
    return careerTests.length > 0 ? getTestLevel(careerTests[0].score) : null;
  };

  const handleStartTests = () => {
    navigate('/mock-test');
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-indigo-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!careerSelection) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Journey</h2>
          <p className="text-gray-600 mb-6">Start by selecting your career paths</p>
          <button
            onClick={() => navigate('/career-selection')}
            className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Choose Careers
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const hasCompletedTests = testResults.length >= 2;

  return (
    <div className="min-h-[80vh] p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* User Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile?.username || 'User'}!
              </h1>
              <p className="text-gray-600 mt-1">
                {profile?.education_level} • {profile?.full_name}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Mock Test Section */}
        {!hasCompletedTests && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="h-6 w-6 text-indigo-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Mock Tests</h2>
                  <p className="text-gray-600">Complete tests to unlock your learning path</p>
                </div>
              </div>
              <button
                onClick={handleStartTests}
                className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Start Tests
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Career Paths Grid */}
        {hasCompletedTests && careerSelection && (
          <div className="grid md:grid-cols-2 gap-6">
            {[careerSelection.career_path_1, careerSelection.career_path_2].map((career, index) => {
              const progress = getCareerProgress(career);
              const testScore = getLatestTestScore(career);
              const level = getCareerLevel(career);

              return (
                <div key={career} className="space-y-6">
                  {/* Career Progress Card */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Career Path {index + 1}</h2>
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{career}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Selected via {careerSelection.selection_mode} mode
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            Overall Progress
                          </div>
                          <span className="text-sm font-medium text-gray-900">{progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Latest Test Score */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                          <span className="text-sm text-gray-600">Latest Test Score</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {testScore !== null ? `${testScore}%` : 'No tests taken'}
                        </span>
                      </div>

                      {/* Learning Modules */}
                      {level && <LearningModule careerPath={career} level={level} />}
                    </div>
                  </div>

                  {/* Career Insights Card */}
                  <CareerInsights careerPath={career} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}