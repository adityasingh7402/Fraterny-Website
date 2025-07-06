import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Trophy, 
  Target, 
  TrendingUp,
  Filter,
  Search,
  Eye,
  Download,
  Star,
  CheckCircle,
  XCircle,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Timer
} from 'lucide-react';
import { useSectionRevealAnimation } from '../../home/useSectionRevealAnimation';
import { profileMotionVariants, getMotionVariants } from '../../../lib/motion/variants';

interface Quest {
  id: string;
  title: string;
  description: string;
  completedAt: string;
  duration: number; // in minutes
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  category: 'personality' | 'behavior' | 'values' | 'goals';
  status: 'completed' | 'abandoned' | 'in_progress';
  insights: string[];
  tags: string[];
}

interface QuestHistoryProps {
  className?: string;
}

// Mock quest data
const mockQuests: Quest[] = [
  {
    id: '1',
    title: 'Deep Personality Assessment',
    description: 'Comprehensive analysis of core personality traits and behavioral patterns',
    completedAt: '2024-12-20T14:30:00Z',
    duration: 25,
    score: 92,
    totalQuestions: 15,
    answeredQuestions: 15,
    category: 'personality',
    status: 'completed',
    insights: ['High openness to experience', 'Strong analytical thinking', 'Collaborative leadership style'],
    tags: ['comprehensive', 'detailed', 'behavioral']
  },
  {
    id: '2',
    title: 'Values & Motivations Discovery',
    description: 'Exploration of core values, motivations, and what drives your decisions',
    completedAt: '2024-12-18T10:15:00Z',
    duration: 18,
    score: 88,
    totalQuestions: 12,
    answeredQuestions: 12,
    category: 'values',
    status: 'completed',
    insights: ['Values authenticity highly', 'Driven by growth and learning', 'Family-oriented decision making'],
    tags: ['values', 'motivation', 'decision-making']
  },
  {
    id: '3',
    title: 'Goal Setting & Ambitions',
    description: 'Understanding your goal-setting patterns and long-term aspirations',
    completedAt: '2024-12-15T16:45:00Z',
    duration: 22,
    score: 85,
    totalQuestions: 18,
    answeredQuestions: 16,
    category: 'goals',
    status: 'completed',
    insights: ['Long-term strategic thinker', 'Values progress over perfection', 'Realistic goal setter'],
    tags: ['goals', 'planning', 'future-focused']
  },
  {
    id: '4',
    title: 'Communication Style Analysis',
    description: 'Deep dive into how you communicate and interact with others',
    completedAt: '2024-12-10T09:20:00Z',
    duration: 15,
    score: 79,
    totalQuestions: 14,
    answeredQuestions: 14,
    category: 'behavior',
    status: 'completed',
    insights: ['Direct communication style', 'Empathetic listener', 'Prefers written over verbal'],
    tags: ['communication', 'interpersonal', 'style']
  },
  {
    id: '5',
    title: 'Stress & Resilience Patterns',
    description: 'Understanding how you handle stress and build resilience',
    completedAt: '2024-12-08T13:30:00Z',
    duration: 30,
    score: 0,
    totalQuestions: 20,
    answeredQuestions: 8,
    category: 'behavior',
    status: 'abandoned',
    insights: [],
    tags: ['stress', 'resilience', 'coping']
  }
];

const categoryColors = {
  personality: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
  behavior: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
  values: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
  goals: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
};

const statusIcons = {
  completed: CheckCircle,
  abandoned: XCircle,
  in_progress: Timer
};

export default function QuestHistory({ className = '' }: QuestHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);

  // Animation setup
  const {
    ref: containerRef,
    parentVariants,
    childVariants,
    isMobile,
    isInView
  } = useSectionRevealAnimation({
    variant: 'professional',
    once: true,
    amount: 0.2,
    staggerChildren: 0.08,
    delayChildren: 0.1
  });

  const motionVariants = getMotionVariants(isMobile);

  // Filter and sort quests
  const filteredQuests = useMemo(() => {
    let filtered = mockQuests.filter(quest => {
      const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || quest.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || quest.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.completedAt).getTime();
          bValue = new Date(b.completedAt).getTime();
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const completed = mockQuests.filter(q => q.status === 'completed');
    const totalDuration = completed.reduce((sum, q) => sum + q.duration, 0);
    const avgScore = completed.length > 0 ? completed.reduce((sum, q) => sum + q.score, 0) / completed.length : 0;
    
    return {
      totalCompleted: completed.length,
      totalDuration,
      averageScore: Math.round(avgScore),
      completionRate: mockQuests.length > 0 ? Math.round((completed.length / mockQuests.length) * 100) : 0
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleSort = (field: 'date' | 'score' | 'duration') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <motion.div
      ref={containerRef}
      variants={parentVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`p-6 lg:p-8 ${className}`}
    >
      {/* Header */}
      <motion.div
        variants={childVariants}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Quest History
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Review your completed assessments and insights
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <motion.button
            variants={motionVariants.tabItem}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        variants={childVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div
          variants={motionVariants.profileCard}
          whileHover="hover"
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalCompleted}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Completed
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={motionVariants.profileCard}
          whileHover="hover"
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatDuration(stats.totalDuration)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Total Time
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={motionVariants.profileCard}
          whileHover="hover"
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.averageScore}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Avg Score
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={motionVariants.profileCard}
          whileHover="hover"
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.completionRate}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Completion
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={childVariants}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search quests..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="personality">Personality</option>
              <option value="behavior">Behavior</option>
              <option value="values">Values</option>
              <option value="goals">Goals</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="abandoned">Abandoned</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Quest List */}
      <motion.div
        variants={motionVariants.listContainer}
        className="space-y-4"
      >
        {filteredQuests.length === 0 ? (
          <motion.div
            variants={childVariants}
            className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-700/50"
          >
            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No quests found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        ) : (
          filteredQuests.map((quest, index) => {
            const StatusIcon = statusIcons[quest.status];
            const isExpanded = expandedQuest === quest.id;
            
            return (
              <motion.div
                key={quest.id}
                variants={motionVariants.listItem}
                whileHover="hover"
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-hidden"
              >
                {/* Main Quest Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <StatusIcon className={`w-5 h-5 ${
                          quest.status === 'completed' ? 'text-green-500' : 
                          quest.status === 'abandoned' ? 'text-red-500' : 
                          'text-orange-500'
                        }`} />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                          {quest.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[quest.category]}`}>
                          {quest.category}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {quest.description}
                      </p>

                      <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(quest.completedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(quest.duration)}</span>
                        </div>
                        {quest.status === 'completed' && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{quest.score}% score</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{quest.answeredQuestions}/{quest.totalQuestions} questions</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {quest.status === 'completed' && (
                        <motion.button
                          variants={motionVariants.tabItem}
                          whileHover="hover"
                          whileTap="tap"
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      )}
                      
                      <motion.button
                        variants={motionVariants.tabItem}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setExpandedQuest(isExpanded ? null : quest.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="border-t border-slate-200 dark:border-slate-700"
                    >
                      <div className="p-6 space-y-4">
                        {/* Tags */}
                        {quest.tags.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {quest.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Insights */}
                        {quest.insights.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Key Insights</h4>
                            <ul className="space-y-1">
                              {quest.insights.map((insight, idx) => (
                                <li key={idx} className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-400">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Progress Bar for Incomplete */}
                        {quest.status !== 'completed' && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Progress</h4>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${(quest.answeredQuestions / quest.totalQuestions) * 100}%` }}
                              />
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {quest.answeredQuestions} of {quest.totalQuestions} questions completed
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}