import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Brain, CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';

interface Question {
  id: number;
  career_path: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface TestResult {
  career_path: string;
  score: number;
  total_questions: number;
}

interface LearningModule {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
}

const MOCK_QUESTIONS: Record<string, Question[]> = {
  'Software Engineer': [
    {
      id: 1,
      career_path: 'Software Engineer',
      question: 'What is the primary purpose of version control systems like Git?',
      options: [
        'To track changes in code and collaborate with others',
        'To compile code faster',
        'To automatically fix bugs',
        'To deploy applications'
      ],
      correct_answer: 'To track changes in code and collaborate with others'
    },
    {
      id: 2,
      career_path: 'Software Engineer',
      question: 'Which data structure would be most efficient for implementing a LIFO pattern?',
      options: [
        'Queue',
        'Stack',
        'Array',
        'Linked List'
      ],
      correct_answer: 'Stack'
    },
    {
      id: 3,
      career_path: 'Software Engineer',
      question: 'What is the purpose of unit testing?',
      options: [
        'To test the entire application at once',
        'To verify individual components work as expected',
        'To check the user interface',
        'To measure application performance'
      ],
      correct_answer: 'To verify individual components work as expected'
    },
    {
      id: 4,
      career_path: 'Software Engineer',
      question: 'What is a RESTful API?',
      options: [
        'A type of database',
        'A programming language',
        'An architectural style for web services',
        'A testing framework'
      ],
      correct_answer: 'An architectural style for web services'
    },
    {
      id: 5,
      career_path: 'Software Engineer',
      question: 'What is the purpose of dependency injection?',
      options: [
        'To make code run faster',
        'To reduce coupling between components',
        'To create user interfaces',
        'To compress files'
      ],
      correct_answer: 'To reduce coupling between components'
    }
  ],
  'Cybersecurity Analyst': [
    {
      id: 1,
      career_path: 'Cybersecurity Analyst',
      question: 'What is the purpose of a firewall in network security?',
      options: [
        'To monitor network traffic and block unauthorized access',
        'To speed up internet connection',
        'To store sensitive data',
        'To compress network packets'
      ],
      correct_answer: 'To monitor network traffic and block unauthorized access'
    },
    {
      id: 2,
      career_path: 'Cybersecurity Analyst',
      question: 'What is a SQL injection attack?',
      options: [
        'A virus that affects SQL databases',
        'A malicious SQL query inserted into application input',
        'A tool for database optimization',
        'A type of database backup'
      ],
      correct_answer: 'A malicious SQL query inserted into application input'
    },
    {
      id: 3,
      career_path: 'Cybersecurity Analyst',
      question: 'What is two-factor authentication?',
      options: [
        'Using two different passwords',
        'Logging in from two devices',
        'Using two security questions',
        'Using two different forms of identification to verify identity'
      ],
      correct_answer: 'Using two different forms of identification to verify identity'
    },
    {
      id: 4,
      career_path: 'Cybersecurity Analyst',
      question: 'What is a DDoS attack?',
      options: [
        'A virus that deletes data',
        'An attempt to make a system unavailable by overwhelming it with traffic',
        'A type of encryption',
        'A software bug'
      ],
      correct_answer: 'An attempt to make a system unavailable by overwhelming it with traffic'
    },
    {
      id: 5,
      career_path: 'Cybersecurity Analyst',
      question: 'What is the purpose of penetration testing?',
      options: [
        'To test network speed',
        'To identify and exploit security vulnerabilities',
        'To backup system data',
        'To monitor user activity'
      ],
      correct_answer: 'To identify and exploit security vulnerabilities'
    }
  ],
  'Data Scientist': [
    {
      id: 1,
      career_path: 'Data Scientist',
      question: 'What is the purpose of data normalization?',
      options: [
        'To increase data size',
        'To scale features to a similar range',
        'To delete duplicate data',
        'To compress data'
      ],
      correct_answer: 'To scale features to a similar range'
    },
    {
      id: 2,
      career_path: 'Data Scientist',
      question: 'What is overfitting in machine learning?',
      options: [
        'When a model performs poorly on training data',
        'When a model performs well on training data but poorly on new data',
        'When a model is too simple',
        'When a model runs too slowly'
      ],
      correct_answer: 'When a model performs well on training data but poorly on new data'
    },
    {
      id: 3,
      career_path: 'Data Scientist',
      question: 'What is the purpose of cross-validation?',
      options: [
        'To clean data',
        'To evaluate model performance on different data subsets',
        'To visualize data',
        'To compress data'
      ],
      correct_answer: 'To evaluate model performance on different data subsets'
    },
    {
      id: 4,
      career_path: 'Data Scientist',
      question: 'What is a confusion matrix used for?',
      options: [
        'To measure model complexity',
        'To evaluate classification model performance',
        'To store data',
        'To generate random numbers'
      ],
      correct_answer: 'To evaluate classification model performance'
    },
    {
      id: 5,
      career_path: 'Data Scientist',
      question: 'What is the purpose of feature engineering?',
      options: [
        'To create new relevant features from existing data',
        'To delete unnecessary data',
        'To compress data',
        'To encrypt data'
      ],
      correct_answer: 'To create new relevant features from existing data'
    }
  ]
};

const LEARNING_MODULES: Record<string, LearningModule[]> = {
  'Software Engineer': [
    {
      name: 'Programming Fundamentals',
      level: 'beginner',
      description: 'Basic concepts of programming and software development'
    },
    {
      name: 'Data Structures & Algorithms',
      level: 'intermediate',
      description: 'Advanced programming concepts and problem-solving'
    },
    {
      name: 'System Design & Architecture',
      level: 'advanced',
      description: 'Enterprise-level software design and best practices'
    }
  ]
};

export default function MockTest() {
  const [currentCareer, setCurrentCareer] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareerPaths = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('career_selections')
          .select('career_path_1, career_path_2')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setCurrentCareer(data.career_path_1);
          setQuestions(MOCK_QUESTIONS[data.career_path_1] || []);
        }
      } catch (err) {
        console.error('Error fetching career paths:', err);
        setError('Failed to load test. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCareerPaths();
  }, [user]);

  const assignLearningPath = async (careerPath: string, score: number) => {
    try {
      let level: 'beginner' | 'intermediate' | 'advanced';
      
      if (score <= 60) {
        level = 'beginner';
      } else if (score <= 80) {
        level = 'intermediate';
      } else {
        level = 'advanced';
      }

      const modules = LEARNING_MODULES[careerPath]?.filter(m => m.level === level) || [];

      const { error } = await supabase
        .from('learning_progress')
        .insert(
          modules.map(module => ({
            user_id: user?.id,
            career_path: careerPath,
            module_name: module.name,
            completion_status: false
          }))
        );

      if (error) throw error;
    } catch (err) {
      console.error('Error assigning learning path:', err);
      setError('Failed to assign learning materials. Please try again.');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex === questions.length - 1) {
      const correctAnswers = questions.reduce((count, question, index) => {
        const userAnswer = index === currentQuestionIndex ? selectedAnswer : null;
        return count + (userAnswer === question.correct_answer ? 1 : 0);
      }, 0);
      
      const score = Math.round((correctAnswers / questions.length) * 100);

      try {
        const { error: saveError } = await supabase
          .from('mock_test_results')
          .insert({
            user_id: user?.id,
            career_path: currentCareer,
            score: score
          });

        if (saveError) throw saveError;

        await assignLearningPath(currentCareer!, score);

        setResults(prev => [...prev, {
          career_path: currentCareer!,
          score,
          total_questions: questions.length
        }]);

        const { data: careerData } = await supabase
          .from('career_selections')
          .select('career_path_1, career_path_2')
          .eq('user_id', user?.id)
          .single();

        if (careerData && currentCareer === careerData.career_path_1) {
          setCurrentCareer(careerData.career_path_2);
          setQuestions(MOCK_QUESTIONS[careerData.career_path_2] || []);
          setCurrentQuestionIndex(0);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error saving test result:', err);
        setError('Failed to save test results. Please try again.');
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
    
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-indigo-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading test...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-[80vh] p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Mock Test: {currentCareer}
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestion?.question}
            </h3>
            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                    isAnswered
                      ? option === currentQuestion.correct_answer
                        ? 'bg-green-100 border-2 border-green-500'
                        : option === selectedAnswer
                        ? 'bg-red-100 border-2 border-red-500'
                        : 'bg-gray-50 border-2 border-transparent'
                      : selectedAnswer === option
                      ? 'bg-indigo-100 border-2 border-indigo-500'
                      : 'bg-gray-50 border-2 border-transparent hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option}</span>
                    {isAnswered && (
                      option === currentQuestion.correct_answer ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : option === selectedAnswer ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : null
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="flex items-center px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                {currentQuestionIndex === questions.length - 1 ? (
                  results.length === 0 ? 'Start Next Career Test' : 'Finish'
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}