import { Question } from './types';

export interface QuestionSection {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const questSections: QuestionSection[] = [
  {
    id: 'section_1',
    title: 'About You',
    description: 'We start with some basic information about you',
    questions: [
      {
        id: 'q1_1',
        text: "What's your name?",
        difficulty: 'easy',
        type: 'text_input',
        category: 'personal_info',
        sectionId: 'section_1'
      },
      {
        id: 'q1_2',
        text: "What's your email?",
        difficulty: 'easy',
        type: 'text_input',
        category: 'personal_info',
        sectionId: 'section_1'
      },
      {
        id: 'q1_3',
        text: "Your Date of Birth",
        difficulty: 'easy',
        type: 'date_input',
        category: 'personal_info',
        sectionId: 'section_1'
      },
      {
        id: 'q1_4',
        text: "What's your gender?",
        difficulty: 'easy',
        type: 'multiple_choice',
        options: ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other'],
        category: 'personal_info',
        sectionId: 'section_1'
      },
      {
        id: 'q1_5',
        text: "Where have you lived the most in your life? (City & Country)",
        difficulty: 'easy',
        type: 'text_input',
        category: 'personal_info',
        sectionId: 'section_1'
      }
    ]
  },
  {
    id: 'section_2',
    title: 'Growing Up',
    description: 'To know your roots',
    questions: [
      {
        id: 'q2_1',
        text: "Who did you grow up living with mostly?",
        difficulty: 'easy',
        type: 'text_input',
        category: 'family',
        sectionId: 'section_2'
      },
      {
        id: 'q2_2',
        text: "Is there anything about your childhood or family life you wish was different?",
        difficulty: 'hard',
        type: 'text_input',
        category: 'family',
        sectionId: 'section_2',
        allowTags: true
      },
      {
        id: 'q2_3',
        text: "Who in your family do you fight with or disagree with the most? Why?",
        difficulty: 'easy',
        type: 'text_input',
        category: 'family',
        sectionId: 'section_2',
        allowTags: true
      }
    ]
  },
  {
    id: 'section_3',
    title: 'What You Value and Want',
    description: 'Understanding your priorities and aspirations',
    questions: [
      {
        id: 'q3_1',
        text: "What is your highest priority goal for this year/month? Basically what you're looking forward to achieve in a time period you have defined for yourself? You can write more than 1 thing.",
        difficulty: 'medium',
        type: 'text_input',
        category: 'goals',
        sectionId: 'section_3',
        allowTags: true
      },
      {
        id: 'q3_2',
        text: "Which of these matters the most to you? And write one sentence explaining why your top choice is most important.",
        difficulty: 'hard',
        type: 'ranking',
        options: ['Being Known/Respected', 'Family', 'Money', 'Peace'],
        category: 'values',
        sectionId: 'section_3',
        allowTags: true,
        additionalInput: {
          type: 'text_input',
          label: 'Explain why your top choice is most important to you'
        }
      },
      {
        id: 'q3_3',
        text: "If you could magically get 3 things in life right now, what would you ask for? Think of anything— \"Ability to fly\", \"Meeting with Jeff Bezos\", \"CEO of Google\", \"I have everything I want, I don't need anything\", \"A pet named Jaws\"",
        difficulty: 'medium',
        type: 'text_input',
        category: 'desires',
        sectionId: 'section_3',
        allowTags: true,
        placeholder: 'Enter up to 3 wishes...'
      },
      {
        id: 'q3_4',
        text: "What's something you feel you understand better than most people around you? It can be more than one thing. Try to be honest, not impressive.",
        difficulty: 'medium',
        type: 'text_input',
        category: 'self_perception',
        sectionId: 'section_3',
        allowTags: true
      },
      {
        id: 'q3_5',
        text: "If you could become the best in the world at one thing, what would it be? And what would you do after becoming the best?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'ambition',
        sectionId: 'section_3',
        allowTags: true
      },
      {
        id: 'q3_6',
        text: "Who's someone (alive or not) that really inspires you? What is it about them that connects with you personally?",
        difficulty: 'hard',
        type: 'text_input',
        category: 'inspiration',
        sectionId: 'section_3',
        allowTags: true
      }
    ]
  },
  {
    id: 'section_4',
    title: 'Patterns and Behavior',
    description: 'Understanding your habits and emotional responses',
    questions: [
      {
        id: 'q4_1',
        text: "What's a habit you have that others say is bad, But you feel it's helping you in some way?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'habits',
        sectionId: 'section_4'
      },
      {
        id: 'q4_2',
        text: "Is there something you do regularly that you know is not good for you, but you can't or don't want to stop?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'habits',
        sectionId: 'section_4'
      },
      {
        id: 'q4_3',
        text: "What's one emotion you find hard to show others? Why do you think that is?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'emotions',
        sectionId: 'section_4'
      },
      {
        id: 'q4_4',
        text: "Are you proud of yourself as a person right now? If yes, what makes you proud? If no, what's missing?",
        difficulty: 'hard',
        type: 'text_input',
        category: 'self_perception',
        sectionId: 'section_4',
        allowTags: true
      }
    ]
  },
  {
    id: 'section_5',
    title: 'Self & Identity',
    description: 'Understanding how you see yourself and how others see you',
    questions: [
      {
        id: 'q5_1',
        text: "How do you think your close friends describe you when you're not around?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'self_perception',
        sectionId: 'section_5',
        allowTags: true
      },
      {
        id: 'q5_2',
        text: "If you had to describe your personality in one sentence, what would you say?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'self_perception',
        sectionId: 'section_5',
        allowTags: true
      },
      {
        id: 'q5_3',
        text: "What's something you wish people understood about you more clearly?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'self_perception',
        sectionId: 'section_5',
        allowTags: true
      }
    ]
  }
];

// Helper function to get all questions in a flat array
export const getAllQuestions = (): Question[] => {
  return questSections.flatMap(section => section.questions);
};

// Helper function to get questions by difficulty
export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  return getAllQuestions().filter(q => q.difficulty === difficulty);
};

// Helper function to get questions by section
export const getQuestionsBySection = (sectionId: string): Question[] => {
  const section = questSections.find(s => s.id === sectionId);
  return section ? section.questions : [];
};

// Summary counts
export const questionSummary = {
  totalQuestions: getAllQuestions().length,
  easyQuestions: getQuestionsByDifficulty('easy').length,
  mediumQuestions: getQuestionsByDifficulty('medium').length,
  hardQuestions: getQuestionsByDifficulty('hard').length,
  sectionCount: questSections.length,
  estimatedTimeMinutes: {
    min: 10,
    max: 15
  }
};

export default questSections;