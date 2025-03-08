import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Play, CheckCircle, Lock, PlayCircle, XCircle, AlertCircle } from 'lucide-react';

// Convert YouTube URL to embed format
const getEmbedUrl = (url: string) => {
  const videoId = url.split('/').pop();
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
};

const VIDEO_URL = 'https://youtu.be/I9JvDaciaFk';

const LEARNING_CONTENT: Record<string, Record<string, ModuleContent>> = {
  'Software Engineer': {
    beginner: {
      name: 'Programming Fundamentals',
      description: 'Learn the basics of programming and software development',
      videos: [
        {
          id: 'se_b_1',
          title: 'Introduction to Programming',
          url: VIDEO_URL,
          duration: 6,
          description: 'Basic concepts and fundamentals of programming'
        },
        {
          id: 'se_b_2',
          title: 'Variables and Data Types',
          url: VIDEO_URL,
          duration: 6,
          description: 'Understanding variables and different data types'
        },
        {
          id: 'se_b_3',
          title: 'Control Flow',
          url: VIDEO_URL,
          duration: 6,
          description: 'Loops, conditions, and program flow'
        },
        {
          id: 'se_b_4',
          title: 'Functions and Methods',
          url: VIDEO_URL,
          duration: 6,
          description: 'Creating reusable code blocks'
        },
        {
          id: 'se_b_5',
          title: 'Object-Oriented Programming',
          url: VIDEO_URL,
          duration: 6,
          description: 'Introduction to OOP concepts'
        }
      ],
      quiz: [
        {
          id: 'se_b_1_q',
          videoId: 'se_b_1',
          question: 'What is programming?',
          options: ['A', 'B', 'C', 'D'],
          correct_answer: 'A'
        },
        {
          id: 'se_b_2_q',
          videoId: 'se_b_2',
          question: 'What is a variable?',
          options: ['A', 'B', 'C', 'D'],
          correct_answer: 'A'
        },
        {
          id: 'se_b_3_q',
          videoId: 'se_b_3',
          question: 'What is a loop?',
          options: ['A', 'B', 'C', 'D'],
          correct_answer: 'A'
        },
        {
          id: 'se_b_4_q',
          videoId: 'se_b_4',
          question: 'What is a function?',
          options: ['A', 'B', 'C', 'D'],
          correct_answer: 'A'
        },
        {
          id: 'se_b_5_q',
          videoId: 'se_b_5',
          question: 'What is OOP?',
          options: ['A', 'B', 'C', 'D'],
          correct_answer: 'A'
        }
      ]
    },
    intermediate: {
      name: 'Advanced Programming Concepts',
      description: 'Dive deeper into software development',
      videos: [
        {
          id: 'se_i_1',
          title: 'Design Patterns',
          url: VIDEO_URL,
          duration: 6,
          description: 'Common software design patterns'
        },
        {
          id: 'se_i_2',
          title: 'API Development',
          url: VIDEO_URL,
          duration: 6,
          description: 'Building RESTful APIs'
        },
        {
          id: 'se_i_3',
          title: 'Database Design',
          url: VIDEO_URL,
          duration: 6,
          description: 'Relational database concepts'
        },
        {
          id: 'se_i_4',
          title: 'Testing Strategies',
          url: VIDEO_URL,
          duration: 6,
          description: 'Unit testing and test-driven development'
        },
        {
          id: 'se_i_5',
          title: 'CI/CD Pipelines',
          url: VIDEO_URL,
          duration: 6,
          description: 'Continuous integration and deployment'
        }
      ],
      quiz: [
        {
          id: 'se_i_1_q',
          videoId: 'se_i_1',
          question: 'What is a design pattern?',
          options: ['A', 'B', 'C', 'D'],
          correct_answer: 'A'
        },
        {
          id: 'se_i_2_q',
          videoId: 'se_i_2',
          question: 'What is an API?',
          options: ['A', 'B', 'C', 'D'],
          correct_answer: 'A'
        },
        {
          id: 'se_i_3_q',
          videoId: 'se_i_3',
          question: 'What is a database?',
          options: ['A', 'B', 'C', 'D'],
          correct_answer: 'A'
        },
        {
          id: 'se_i_4_q',
          videoId: 'se_i_4',
          question: 'What is unit testing?',
          options: ['A', 'B', 'C', 'D'],
          correct_answer: 'A'
        },
        {
          id: 'se_i_5_q',
          videoId: 'se_i_5',
          question: 'What is CI/CD?',
          options: ['A', 'B', 'C', 'D'],
          correct_answer: 'A'
        }
      ]
    }
  },
  'Cybersecurity Analyst': {
    beginner: {
      name: 'Security Fundamentals',
      description: 'Learn the basics of cybersecurity',
      videos: [
        {
          id: 'cs_b_1',
          title: 'Introduction to Cybersecurity',
          url: VIDEO_URL,
          duration: 6,
          description: 'Basic concepts and terminology'
        },
        {
          id: 'cs_b_2',
          title: 'Network Security Basics',
          url: VIDEO_URL,
          duration: 6,
          description: 'Understanding network security'
        },
        {
          id: 'cs_b_3',
          title: 'Common Security Threats',
          url: VIDEO_URL,
          duration: 6,
          description: 'Overview of security threats'
        },
        {
          id: 'cs_b_4',
          title: 'Security Tools',
          url: VIDEO_URL,
          duration: 6,
          description: 'Basic security tools and usage'
        },
        {
          id: 'cs_b_5',
          title: 'Security Best Practices',
          url: VIDEO_URL,
          duration: 6,
          description: 'Essential security practices'
        }
      ],
      quiz: [
        {
          id: 'cs_q1',
          videoId: 'cs_b_1',
          question: 'What is cybersecurity?',
          options: [
            'Protection of computer systems from threats',
            'A type of computer virus',
            'A programming language',
            'A network protocol'
          ],
          correct_answer: 'Protection of computer systems from threats'
        }
      ]
    },
    intermediate: {
      name: 'Advanced Security',
      description: 'Advanced cybersecurity concepts and techniques',
      videos: [
        {
          id: 'cs_i_1',
          title: 'Penetration Testing',
          url: VIDEO_URL,
          duration: 6,
          description: 'Introduction to penetration testing'
        },
        {
          id: 'cs_i_2',
          title: 'Incident Response',
          url: VIDEO_URL,
          duration: 6,
          description: 'Handling security incidents'
        },
        {
          id: 'cs_i_3',
          title: 'Malware Analysis',
          url: VIDEO_URL,
          duration: 6,
          description: 'Understanding and analyzing malware'
        },
        {
          id: 'cs_i_4',
          title: 'Cloud Security',
          url: VIDEO_URL,
          duration: 6,
          description: 'Security in cloud environments'
        },
        {
          id: 'cs_i_5',
          title: 'Security Automation',
          url: VIDEO_URL,
          duration: 6,
          description: 'Automating security tasks'
        }
      ],
      quiz: [
        {
          id: 'cs_q2',
          videoId: 'cs_i_1',
          question: 'What is penetration testing?',
          options: [
            'Authorized simulated attack on a system',
            'Testing network speed',
            'Writing secure code',
            'Installing security software'
          ],
          correct_answer: 'Authorized simulated attack on a system'
        }
      ]
    }
  },
  'Data Scientist': {
    beginner: {
      name: 'Data Science Basics',
      description: 'Introduction to data science concepts',
      videos: [
        {
          id: 'ds_b_1',
          title: 'Introduction to Data Science',
          url: VIDEO_URL,
          duration: 6,
          description: 'Overview of data science'
        },
        {
          id: 'ds_b_2',
          title: 'Data Collection',
          url: VIDEO_URL,
          duration: 6,
          description: 'Methods of data collection'
        },
        {
          id: 'ds_b_3',
          title: 'Data Cleaning',
          url: VIDEO_URL,
          duration: 6,
          description: 'Basic data cleaning techniques'
        },
        {
          id: 'ds_b_4',
          title: 'Exploratory Analysis',
          url: VIDEO_URL,
          duration: 6,
          description: 'Basic data analysis'
        },
        {
          id: 'ds_b_5',
          title: 'Data Visualization',
          url: VIDEO_URL,
          duration: 6,
          description: 'Creating data visualizations'
        }
      ],
      quiz: [
        {
          id: 'ds_q1',
          videoId: 'ds_b_1',
          question: 'What is data science?',
          options: [
            'Extracting insights from data',
            'Writing computer programs',
            'Building websites',
            'Managing databases'
          ],
          correct_answer: 'Extracting insights from data'
        }
      ]
    },
    intermediate: {
      name: 'Advanced Data Science',
      description: 'Advanced data science and machine learning',
      videos: [
        {
          id: 'ds_i_1',
          title: 'Machine Learning Basics',
          url: VIDEO_URL,
          duration: 6,
          description: 'Introduction to machine learning'
        },
        {
          id: 'ds_i_2',
          title: 'Statistical Analysis',
          url: VIDEO_URL,
          duration: 6,
          description: 'Advanced statistical methods'
        },
        {
          id: 'ds_i_3',
          title: 'Deep Learning',
          url: VIDEO_URL,
          duration: 6,
          description: 'Neural networks and deep learning'
        },
        {
          id: 'ds_i_4',
          title: 'Natural Language Processing',
          url: VIDEO_URL,
          duration: 6,
          description: 'Text analysis and NLP'
        },
        {
          id: 'ds_i_5',
          title: 'Big Data Processing',
          url: VIDEO_URL,
          duration: 6,
          description: 'Working with large datasets'
        }
      ],
      quiz: [
        {
          id: 'ds_q2',
          videoId: 'ds_i_1',
          question: 'What is machine learning?',
          options: [
            'Systems that learn from data',
            'Manual data analysis',
            'Computer hardware',
            'Database management'
          ],
          correct_answer: 'Systems that learn from data'
        }
      ]
    }
  }
};

interface Video {
  id: string;
  title: string;
  url: string;
  duration: number;
  description: string;
}

interface Quiz {
  id: string;
  videoId: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface ModuleContent {
  name: string;
  description: string;
  videos: Video[];
  quiz: Quiz[];
}

interface VideoProgress {
  videoId: string;
  completed: boolean;
  quizCompleted: boolean;
}

interface Props {
  careerPath: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export default function LearningModule({ careerPath, level }: Props) {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<VideoProgress[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showQuiz, setShowQuiz] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const content = LEARNING_CONTENT[careerPath]?.[level];

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || !content) return;

      try {
        // Fetch video progress
        const { data: videoData, error: videoError } = await supabase
          .from('video_progress')
          .select('video_id, completed')
          .eq('user_id', user.id);

        if (videoError) throw videoError;

        // Fetch quiz results
        const { data: quizData, error: quizError } = await supabase
          .from('quiz_results')
          .select('video_id, score')
          .eq('user_id', user.id);

        if (quizError) throw quizError;

        // Combine video and quiz progress
        const progress = content.videos.map(video => ({
          videoId: video.id,
          completed: videoData?.some(p => p.video_id === video.id && p.completed) || false,
          quizCompleted: quizData?.some(q => q.video_id === video.id && q.score >= 70) || false
        }));

        setVideoProgress(progress);
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, content, careerPath]);

  const calculateProgress = () => {
    if (!content || videoProgress.length === 0) return 0;
    
    const totalItems = content.videos.length * 2; // Each video + quiz
    const completedVideos = videoProgress.filter(p => p.completed).length;
    const completedQuizzes = videoProgress.filter(p => p.quizCompleted).length;
    
    return Math.round(((completedVideos * 15 + completedQuizzes * 5) / (totalItems * 10)) * 100);
  };

  const handleVideoComplete = async (videoId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          video_id: videoId,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      setVideoProgress(prev => 
        prev.map(p => p.videoId === videoId ? { ...p, completed: true } : p)
      );
    } catch (err) {
      console.error('Error updating video progress:', err);
      setError('Failed to save progress');
    }
  };

  const handleQuizSubmit = async (videoId: string) => {
    if (!user || !content) return;

    const videoQuiz = content.quiz.find(q => q.videoId === videoId);
    if (!videoQuiz) return;

    const answer = quizAnswers[videoId];
    const isCorrect = answer === videoQuiz.correct_answer;
    const score = isCorrect ? 100 : 0;

    try {
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          video_id: videoId,
          career_path: careerPath,
          score: score
        });

      if (error) throw error;

      setVideoProgress(prev =>
        prev.map(p => p.videoId === videoId ? { ...p, quizCompleted: isCorrect } : p)
      );
      setShowQuiz(null);
      setQuizAnswers(prev => ({ ...prev, [videoId]: '' }));
    } catch (err) {
      console.error('Error saving quiz result:', err);
      setError('Failed to save quiz result');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        No learning content available for this career path and level.
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{content.name}</h3>
            <p className="text-gray-600 mt-1">{content.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">{progress}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        <div className="h-2 bg-gray-200 rounded-full mb-8">
          <div
            className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-4">
          {content.videos.map((video, index) => {
            const progress = videoProgress.find(p => p.videoId === video.id);
            const isCompleted = progress?.completed || false;
            const isQuizCompleted = progress?.quizCompleted || false;
            const canTakeQuiz = isCompleted && !isQuizCompleted;
            const isLocked = index > 0 && !videoProgress[index - 1]?.completed;

            return (
              <div key={video.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="h-5 w-5 text-gray-400" />
                    ) : currentVideo === video.id ? (
                      <Play className="h-5 w-5 text-indigo-600 animate-pulse" />
                    ) : (
                      <PlayCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <h5 className="font-medium text-gray-900">{video.title}</h5>
                      <p className="text-sm text-gray-600">{video.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isQuizCompleted && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Quiz Passed
                      </span>
                    )}
                    <span className="text-sm text-gray-500">{video.duration}s</span>
                  </div>
                </div>

                {currentVideo === video.id && (
                  <div className="mt-4">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={getEmbedUrl(VIDEO_URL)}
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        onLoad={() => {
                          // Start a timer to mark video as completed after its duration
                          setTimeout(() => handleVideoComplete(video.id), video.duration * 1000);
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 space-x-4">
                  {!isLocked && (
                    <button
                      onClick={() => setCurrentVideo(video.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {isCompleted ? 'Watch Again' : 'Start Learning'}
                    </button>
                  )}

                  {canTakeQuiz && (
                    <button
                      onClick={() => setShowQuiz(video.id)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Take Quiz
                    </button>
                  )}
                </div>

                {showQuiz === video.id && (
                  <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                    <h6 className="font-medium text-gray-900 mb-4">
                      Quick Quiz: {video.title}
                    </h6>
                    <div className="space-y-4">
                      {content.quiz
                        .filter(q => q.videoId === video.id)
                        .map(question => (
                          <div key={question.id}>
                            <p className="text-gray-900 mb-2">{question.question}</p>
                            <div className="space-y-2">
                              {question.options.map((option, i) => (
                                <button
                                  key={option}
                                  onClick={() => setQuizAnswers(prev => ({
                                    ...prev,
                                    [video.id]: option
                                  }))}
                                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                                    quizAnswers[video.id] === option
                                      ? 'bg-indigo-100 border-2 border-indigo-500'
                                      : 'bg-gray-50 border-2 border-gray-200 hover:border-indigo-300'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      <button
                        onClick={() => handleQuizSubmit(video.id)}
                        disabled={!quizAnswers[video.id]}
                        className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}