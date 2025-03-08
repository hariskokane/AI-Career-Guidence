import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Bot } from 'lucide-react';

interface Message {
  type: 'bot' | 'user';
  content: string | React.ReactNode;
  options?: string[];
  id?: string;
}

interface ChatbotProps {
  username: string;
  onCareersSelected: (careers: string[]) => void;
}

interface Subject {
  description: string;
  preferences: string[];
  strengths: string[];
  careers: string[];
}

const subjects: Record<string, Subject> = {
  'Technology & Engineering': {
    description: 'This field involves creating innovative solutions using technology and engineering principles.',
    preferences: [
      'Building and creating technology solutions',
      'Solving complex technical problems',
      'Working with cutting-edge technologies'
    ],
    strengths: [
      'Problem-solving and analytical thinking',
      'Technical skills and programming',
      'Innovation and creativity in technology'
    ],
    careers: [
      'Software Engineer',
      'Cybersecurity Analyst',
      'Data Scientist'
    ]
  },
  'Finance & Business': {
    description: 'This field focuses on managing financial resources and business operations.',
    preferences: [
      'Managing investments and financial analysis',
      'Developing business strategies',
      'Leading teams and projects'
    ],
    strengths: [
      'Financial analysis and planning',
      'Strategic thinking and decision making',
      'Leadership and communication'
    ],
    careers: [
      'Financial Analyst',
      'Investment Banker',
      'Business Consultant'
    ]
  },
  'Healthcare & Medicine': {
    description: 'This field involves caring for people\'s health and well-being.',
    preferences: [
      'Helping people with their health',
      'Working in medical environments',
      'Conducting medical research'
    ],
    strengths: [
      'Attention to detail and precision',
      'Empathy and patient care',
      'Medical knowledge and research'
    ],
    careers: [
      'Doctor',
      'Medical Lab Technician',
      'Nurse'
    ]
  },
  'Creative Careers': {
    description: 'This field involves expressing creativity through various mediums.',
    preferences: [
      'Creating visual designs and artwork',
      'Developing user experiences',
      'Storytelling through animation'
    ],
    strengths: [
      'Visual design and creativity',
      'User experience design',
      'Animation and motion graphics'
    ],
    careers: [
      'Graphic Designer',
      'UX/UI Designer',
      'Animator'
    ]
  }
};

export default function CareerChatbot({ username, onCareersSelected }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPreference, setSelectedPreference] = useState('');
  const [selectedStrength, setSelectedStrength] = useState('');
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showOptions, setShowOptions] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const addMessage = (message: Message, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => {
        if (message.id && prev.some(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
      setIsTyping(false);
    }, delay);
  };

  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    addMessage({
      type: 'bot',
      content: (
        <div>
          <p className="mb-2">
            Hello {username}! 👋 Welcome to <span className="font-semibold">Parallel Skill Worlds</span>.
          </p>
          <p>I'm your AI career guide, and I'm excited to help you discover your ideal career paths!</p>
          <p className="mt-2">Feel free to ask me any questions about careers or tell me what interests you.</p>
        </div>
      ),
      id: 'greeting'
    }, 500);

    setTimeout(() => {
      addMessage({
        type: 'bot',
        content: (
          <div>
            <p className="mb-2">Let's start by exploring your interests.</p>
            <p>Which of these fields excites you the most? 🤔</p>
          </div>
        ),
        options: Object.keys(subjects),
        id: 'initial-question'
      });
    }, 2000);
  }, [username]);

  const handleSubjectSelection = (subject: string) => {
    setSelectedSubject(subject);
    setMessages(prev => [...prev, { type: 'user', content: subject }]);
    
    addMessage({
      type: 'bot',
      content: (
        <div>
          <p className="mb-2">Excellent choice! 🌟</p>
          <p>{subjects[subject].description}</p>
          <p className="mt-2">What aspects of {subject} interest you the most?</p>
        </div>
      ),
      options: subjects[subject].preferences
    });
    setCurrentStep(1);
  };

  const handlePreferenceSelection = (preference: string) => {
    setSelectedPreference(preference);
    setMessages(prev => [...prev, { type: 'user', content: preference }]);
    
    addMessage({
      type: 'bot',
      content: (
        <div>
          <p className="mb-2">That's fascinating! 💡</p>
          <p>To help me recommend the best career paths, could you tell me what you consider your strongest skill in this area?</p>
        </div>
      ),
      options: subjects[selectedSubject].strengths
    });
    setCurrentStep(2);
  };

  const handleStrengthSelection = (strength: string) => {
    setSelectedStrength(strength);
    setMessages(prev => [...prev, { type: 'user', content: strength }]);
    
    const careerOptions = subjects[selectedSubject].careers;
    addMessage({
      type: 'bot',
      content: (
        <div>
          <p className="mb-2">Perfect! Based on your interests and strengths, I've analyzed the best career paths for you. 🎯</p>
          <p className="mb-4">Here are three excellent careers that align with your profile:</p>
          <div className="space-y-3">
            {careerOptions.map((career, index) => (
              <div key={career} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                <span className="text-indigo-600 font-semibold">#{index + 1}</span>
                <span className="font-medium">{career}</span>
              </div>
            ))}
          </div>
          <p className="mt-4">Please select two careers you'd like to explore further. I'll help you develop skills for both paths! 🚀</p>
        </div>
      ),
      options: careerOptions
    });
    setCurrentStep(3);
  };

  const handleCareerSelection = (career: string) => {
    if (selectedCareers.includes(career)) {
      setSelectedCareers(prev => prev.filter(c => c !== career));
    } else if (selectedCareers.length < 2) {
      setSelectedCareers(prev => [...prev, career]);
    }
  };

  const handleUserInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: userInput }]);
    setShowOptions(false);

    setIsTyping(true);
    setTimeout(() => {
      let response = "I understand you're interested in learning more. ";
      if (userInput.toLowerCase().includes('salary')) {
        response += "Salary ranges vary by experience and location. Would you like to explore specific career paths and their potential earnings?";
      } else if (userInput.toLowerCase().includes('education')) {
        response += "Educational requirements differ for each career. Shall we look at the qualifications needed for specific roles?";
      } else if (userInput.toLowerCase().includes('skills')) {
        response += "Different careers require different skill sets. Would you like to know what skills are most valuable in your field of interest?";
      } else {
        response += "Would you like to explore specific career paths or learn more about certain aspects of these professions?";
      }

      addMessage({
        type: 'bot',
        content: response,
        options: ['Continue with career selection', 'Ask another question']
      });
    }, 1000);

    setUserInput('');
  };

  const handleFinalSelection = () => {
    if (selectedCareers.length === 2) {
      setMessages(prev => [...prev, {
        type: 'user',
        content: `I choose ${selectedCareers.join(' and ')}`
      }]);

      addMessage({
        type: 'bot',
        content: (
          <div>
            <p className="mb-2">Outstanding choices! 🎉</p>
            <p>You've selected:</p>
            <ul className="list-disc list-inside my-2">
              {selectedCareers.map(career => (
                <li key={career} className="text-indigo-600 font-medium">{career}</li>
              ))}
            </ul>
            <p className="mt-2">I'm excited to guide you on your journey! Let's start with some personalized assessments and learning materials for these career paths. 📚</p>
          </div>
        )
      });

      setTimeout(() => {
        onCareersSelected(selectedCareers);
      }, 2000);
    }
  };

  const renderOptions = (options: string[] = [], handler: (option: string) => void) => {
    if (!showOptions) return null;

    if (currentStep === 3) {
      return (
        <div className="flex flex-wrap gap-2 mb-4">
          {options.map(option => (
            <button
              key={option}
              onClick={() => handleCareerSelection(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCareers.includes(option)
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
              disabled={selectedCareers.length === 2 && !selectedCareers.includes(option)}
            >
              {option}
            </button>
          ))}
          {selectedCareers.length === 2 && (
            <button
              onClick={handleFinalSelection}
              className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Start with these careers</span>
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {options.map(option => (
          <button
            key={option}
            onClick={() => handler(option)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 bg-indigo-600 text-white flex items-center space-x-2">
        <Bot className="h-5 w-5" />
        <span className="font-medium">Career Guide AI</span>
      </div>
      
      <div className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          {!isTyping && messages[messages.length - 1]?.options && (
            <div className="mb-4">
              {renderOptions(
                messages[messages.length - 1].options,
                currentStep === 0
                  ? handleSubjectSelection
                  : currentStep === 1
                  ? handlePreferenceSelection
                  : currentStep === 2
                  ? handleStrengthSelection
                  : handleCareerSelection
              )}
            </div>
          )}

          <form onSubmit={handleUserInput} className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything about careers..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}