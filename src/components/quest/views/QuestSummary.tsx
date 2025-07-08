import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuest } from '../core/useQuest';
import { QuestionResponse, Question, QuestionSection } from '../core/types';
import { 
  formatDate, 
  formatDuration, 
  formatResponse, 
  getTagColor, 
  getDifficultyColor 
} from '../utils/questionFormattting';

interface QuestSummaryProps {
  onSubmit: () => void;
  onBack: () => void;
  className?: string;
}

/**
 * Summary component for displaying all quest responses before final submission
 */
export function QuestSummary({
  onSubmit,
  onBack,
  className = ''
}: QuestSummaryProps) {
  const { 
    session, 
    questions, 
    sections,
    allQuestions
  } = useQuest();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Calculate completion time
  const startTime = session?.startedAt ? new Date(session.startedAt) : new Date();
  const endTime = new Date();
  const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Handle final submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error('Error submitting quest:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format response data for display
  const formatResponseData = () => {
    if (!session || !session.responses) return [];
    
    return Object.entries(session.responses).map(([questionId, response]) => {
      const question = allQuestions.find(q => q.id === questionId);
      const sectionId = question?.sectionId || '';
      const section = sections.find(s => s.id === sectionId);
      
      return {
        question_id: questionId,
        question_text: question?.text || '',
        answer: response.response,
        question_type: question?.type || 'text_input',
        section_id: sectionId,
        section_name: section?.title || '',
        difficulty: question?.difficulty || 'medium',
        metadata: {
          tags: response.tags || [],
          timestamp: response.timestamp
        }
      };
    });
  };
  
  // Calculate analytics data
  const calculateAnalytics = () => {
    if (!session || !session.responses) return null;
    
    const responses = Object.values(session.responses);
    const tagCounts: Record<string, number> = {};
    const difficultyCounts: Record<string, number> = {
      easy: 0,
      medium: 0,
      hard: 0
    };
    
    // Calculate tag distribution
    responses.forEach(response => {
      if (response.tags) {
        response.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
      
      const question = allQuestions.find(q => q.id === response.questionId);
      if (question) {
        difficultyCounts[question.difficulty] = 
          (difficultyCounts[question.difficulty] || 0) + 1;
      }
    });
    
    return {
      tag_distribution: tagCounts,
      difficulty_breakdown: difficultyCounts,
      total_responses: responses.length,
      completion_percentage: 
        (responses.length / (allQuestions.length || 1)) * 100
    };
  };
  
  const responseData = formatResponseData();
  const analytics = calculateAnalytics();
  
  return (
    <div className={`quest-summary ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        {/* Header */}
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-2xl font-playfair text-navy">
            Assessment Summary
          </h2>
          <p className="text-gray-600 mt-1">
            Review your responses before final submission
          </p>
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500">Completion Time</div>
            <div className="text-xl font-medium">
              {formatDuration(durationMinutes)}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500">Questions Answered</div>
            <div className="text-xl font-medium">
              {responseData.length} / {allQuestions.length}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500">Completion</div>
            <div className="text-xl font-medium">
              {Math.round((responseData.length / (allQuestions.length || 1)) * 100)}%
            </div>
          </div>
        </div>
        
        {/* Response Details */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-navy mb-3">
            Your Responses
          </h3>
          
          {sections.map((section) => (
            <div key={section.id} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div>
                  <h4 className="font-medium">{section.title}</h4>
                  <div className="text-sm text-gray-500">
                    {section.questions.length} questions
                  </div>
                </div>
                <div className="text-navy">
                  {expandedSections[section.id] ? '−' : '+'}
                </div>
              </button>
              
              {/* Section Questions */}
              {expandedSections[section.id] && (
                <div className="p-4 space-y-4">
                  {section.questions.map((question) => {
                    const response = session?.responses?.[question.id];
                    
                    if (!response) {
                      return (
                        <div key={question.id} className="border-b border-gray-100 pb-3">
                          <div className="text-navy font-medium mb-1">
                            {question.text}
                          </div>
                          <div className="text-gray-500 italic">Not answered</div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={question.id} className="border-b border-gray-100 pb-3">
                        <div className={`font-medium mb-1 ${getDifficultyColor(question.difficulty)}`}>
                          {question.text}
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          {formatResponse(response.response, question.type)}
                        </div>
                        
                        {response.tags && response.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {response.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`text-xs px-2 py-1 rounded-full ${getTagColor(tag)}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-400 mt-1">
                          Answered: {formatDate(response.timestamp)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Analytics Summary */}
        {analytics && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-navy mb-3">
              Response Analytics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tag Distribution */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Response Tags</h4>
                <div className="space-y-2">
                  {Object.entries(analytics.tag_distribution).map(([tag, count]) => (
                    <div key={tag} className="flex items-center">
                      <div className="w-24 text-sm">{tag}</div>
                      <div className="flex-grow h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-terracotta"
                          style={{
                            width: `${(count / analytics.total_responses) * 100}%`
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sm ml-2">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Difficulty Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Difficulty Levels</h4>
                <div className="space-y-2">
                  {Object.entries(analytics.difficulty_breakdown).map(([difficulty, count]) => (
                    <div key={difficulty} className="flex items-center">
                      <div className="w-24 text-sm capitalize">{difficulty}</div>
                      <div className="flex-grow h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            difficulty === 'easy'
                              ? 'bg-terracotta'
                              : difficulty === 'medium'
                              ? 'bg-navy'
                              : 'bg-gold'
                          }`}
                          style={{
                            width: `${(count / analytics.total_responses) * 100}%`
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sm ml-2">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Back to Assessment
          </motion.button>
          
          <motion.button
            onClick={() => setShowConfirmation(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </motion.button>
        </div>
      </motion.div>
      
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-medium text-navy mb-2">
              Submit Assessment
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to submit your assessment? You won't be able to change your answers after submission.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default QuestSummary;