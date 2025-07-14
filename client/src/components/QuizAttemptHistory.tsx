import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, Calendar, TrendingUp, Eye, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { QuizData } from "../types";

interface QuizAttempt {
  id: number;
  userId: number;
  quizData: QuizData;
  completedAt: string;
}

interface QuizAttemptHistoryProps {
  userId: number;
}

export const QuizAttemptHistory: React.FC<QuizAttemptHistoryProps> = ({
  userId,
}) => {
  const {
    data: attempts = [],
    isLoading,
    error,
  } = useQuery<QuizAttempt[]>({
    queryKey: [`/api/quiz-attempts/${userId}`],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quiz History
        </h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quiz History
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Unable to load quiz history.
        </p>
      </div>
    );
  }

  if (!attempts || !attempts.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quiz History
        </h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">
            No quiz attempts yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            Take the quiz to discover your ideal business path and track your
            results here
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Your history will show:
            </p>
            <ul className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
              <li>• Top business recommendations</li>
              <li>• Quiz completion dates</li>
              <li>• Income goals and preferences</li>
              <li>• Progress tracking over time</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const getTopBusinessPath = (quizData: QuizData) => {
    // Simple scoring logic - in real app this would use the full algorithm
    const motivations = quizData.mainMotivation || "";
    if (motivations.includes("financial")) return "Affiliate Marketing";
    if (motivations.includes("passion")) return "Content Creation";
    if (motivations.includes("freedom")) return "Freelancing";
    return "Digital Services";
  };

  const getIncomeGoal = (quizData: QuizData) => {
    const goal = quizData.successIncomeGoal;
    if (!goal) return "Not specified";
    if (goal < 1000) return `$${goal}/month`;
    if (goal < 10000) return `$${(goal / 1000).toFixed(1)}K/month`;
    return `$${(goal / 1000).toFixed(0)}K/month`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quiz History
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {attempts.length} attempt{attempts.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {attempts.map((attempt: QuizAttempt, index: number) => (
          <div
            key={attempt.id}
            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {/* Attempt Number Icon */}
            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                  index === 0
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : "bg-gray-500"
                }`}
              >
                {attempts.length - index}
              </div>
            </div>

            {/* Attempt Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {getTopBusinessPath(attempt.quizData)}
                </p>
                {index === 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Latest
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {format(new Date(attempt.completedAt), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{getIncomeGoal(attempt.quizData)}</span>
                </div>
              </div>
            </div>

            {/* View Details Button */}
            <button className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {attempts.length > 3 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center justify-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            <span>View All Attempts</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
