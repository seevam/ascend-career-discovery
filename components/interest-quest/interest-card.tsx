'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RankedInterest } from '@/types/interest-quest';

interface InterestCardProps {
  interest: RankedInterest;
  icon: string;
}

export default function InterestCard({ interest, icon }: InterestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRankBadge = (rank: 1 | 2 | 3) => {
    const badges = {
      1: { text: '1st', emoji: '🥇', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      2: { text: '2nd', emoji: '🥈', color: 'bg-gray-100 text-gray-800 border-gray-300' },
      3: { text: '3rd', emoji: '🥉', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    };
    return badges[rank];
  };

  const badge = getRankBadge(interest.rank);

  return (
    <Card className="overflow-hidden border-2 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{icon}</div>
            <div>
              <CardTitle className="text-2xl">{interest.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge className={`border ${badge.color}`}>
                  {badge.emoji} {badge.text} Place
                </Badge>
                <span className="text-2xl font-bold text-purple-600">
                  {interest.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="mb-4 text-gray-700 leading-relaxed">
          {interest.description}
        </p>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left font-medium text-gray-900 transition-colors hover:bg-gray-100"
        >
          <span>View Careers & Skills</span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4 rounded-lg bg-gray-50 p-4">
            {/* Sample Careers */}
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                <span className="text-lg">💼</span>
                Sample Careers
              </h4>
              <div className="flex flex-wrap gap-2">
                {interest.sampleCareers.map((career, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white text-gray-700"
                  >
                    {career}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skills to Develop */}
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                <span className="text-lg">🛠️</span>
                Skills to Develop
              </h4>
              <ul className="space-y-1">
                {interest.skillsToDevelop.map((skill, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1 text-purple-500">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
