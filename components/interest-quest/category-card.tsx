'use client';

import { Card } from '@/components/ui/card';

interface CategoryCardProps {
  icon: string;
  name: string;
  description: string;
  completed: boolean;
  onClick?: () => void;
}

export default function CategoryCard({
  icon,
  name,
  description,
  completed,
  onClick,
}: CategoryCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`
        group relative cursor-pointer overflow-hidden transition-all duration-300
        ${
          completed
            ? 'border-green-300 bg-green-50/50 hover:shadow-lg'
            : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-xl'
        }
      `}
    >
      <div className="p-6">
        {/* Completed Checkmark */}
        {completed && (
          <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {/* Icon */}
        <div
          className={`
          mb-4 text-5xl transition-transform duration-300
          ${completed ? '' : 'group-hover:scale-110'}
        `}
        >
          {icon}
        </div>

        {/* Name */}
        <h3
          className={`
          mb-2 text-xl font-bold transition-colors
          ${completed ? 'text-green-900' : 'text-gray-900 group-hover:text-purple-700'}
        `}
        >
          {name}
        </h3>

        {/* Description */}
        <p
          className={`
          text-sm
          ${completed ? 'text-green-700' : 'text-gray-600'}
        `}
        >
          {description}
        </p>

        {/* Hover Effect Gradient */}
        {!completed && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}

        {/* Status Badge */}
        <div className="mt-4">
          {completed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors group-hover:bg-purple-100 group-hover:text-purple-800">
              Start Exploring →
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
