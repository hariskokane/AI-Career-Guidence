import React from 'react';
import { TrendingUp, DollarSign, Briefcase } from 'lucide-react';

interface CareerInsight {
  marketDemand: {
    level: 'High' | 'Medium' | 'Low';
    growth: string;
    description: string;
  };
  salaryRange: {
    entry: string;
    mid: string;
    senior: string;
  };
  trends: string[];
}

const CAREER_INSIGHTS: Record<string, CareerInsight> = {
  'Software Engineer': {
    marketDemand: {
      level: 'High',
      growth: '22%',
      description: 'Continued strong growth due to digital transformation across industries'
    },
    salaryRange: {
      entry: '$70,000',
      mid: '$100,000',
      senior: '$150,000+'
    },
    trends: [
      'Increased demand for AI/ML expertise',
      'Rise of remote-first development teams',
      'Growing emphasis on cloud-native development',
      'Focus on cybersecurity integration'
    ]
  },
  'Cybersecurity Analyst': {
    marketDemand: {
      level: 'High',
      growth: '31%',
      description: 'Critical demand driven by increasing cyber threats and regulations'
    },
    salaryRange: {
      entry: '$65,000',
      mid: '$95,000',
      senior: '$140,000+'
    },
    trends: [
      'Zero-trust architecture adoption',
      'Cloud security specialization',
      'AI-powered threat detection',
      'IoT security focus'
    ]
  },
  'Data Scientist': {
    marketDemand: {
      level: 'High',
      growth: '28%',
      description: 'Strong growth due to data-driven decision making across sectors'
    },
    salaryRange: {
      entry: '$75,000',
      mid: '$110,000',
      senior: '$160,000+'
    },
    trends: [
      'AutoML adoption',
      'Real-time analytics growth',
      'Edge computing integration',
      'Ethical AI focus'
    ]
  },
  'Financial Analyst': {
    marketDemand: {
      level: 'Medium',
      growth: '15%',
      description: 'Steady growth with increasing focus on data-driven financial decisions'
    },
    salaryRange: {
      entry: '$60,000',
      mid: '$85,000',
      senior: '$120,000+'
    },
    trends: [
      'FinTech integration',
      'ESG investing growth',
      'Blockchain technology adoption',
      'AI-driven analysis'
    ]
  }
};

interface Props {
  careerPath: string;
}

export default function CareerInsights({ careerPath }: Props) {
  const insights = CAREER_INSIGHTS[careerPath];
  
  if (!insights) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Career Insights</h3>
      
      {/* Market Demand */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
          <h4 className="font-medium text-gray-900">Market Demand</h4>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              insights.marketDemand.level === 'High'
                ? 'bg-green-100 text-green-800'
                : insights.marketDemand.level === 'Medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {insights.marketDemand.level} Demand
            </span>
            <span className="ml-2 text-sm text-gray-600">
              {insights.marketDemand.growth} projected growth
            </span>
          </div>
          <p className="text-sm text-gray-600">{insights.marketDemand.description}</p>
        </div>
      </div>

      {/* Salary Range */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <DollarSign className="h-5 w-5 text-indigo-600 mr-2" />
          <h4 className="font-medium text-gray-900">Expected Salary Range</h4>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-600 mb-1">Entry Level</div>
            <div className="font-semibold text-gray-900">{insights.salaryRange.entry}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-600 mb-1">Mid Level</div>
            <div className="font-semibold text-gray-900">{insights.salaryRange.mid}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-600 mb-1">Senior Level</div>
            <div className="font-semibold text-gray-900">{insights.salaryRange.senior}</div>
          </div>
        </div>
      </div>

      {/* Future Trends */}
      <div>
        <div className="flex items-center mb-3">
          <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
          <h4 className="font-medium text-gray-900">Future Trends</h4>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <ul className="space-y-2">
            {insights.trends.map((trend, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
                {trend}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}