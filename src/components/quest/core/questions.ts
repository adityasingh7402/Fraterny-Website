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
    title: 'Self',
    description: 'We start with some basic information about you',
    questions: [
      {
        id: 'q1_1',
        text: "What's your name?",
        difficulty: 'easy',
        type: 'text_input',
        category: 'personal_info',
        sectionId: 'section_1',
        placeholder: 'Your name',
        allowAnonymous: true,
        isInfo: true,
        infoText: 'This is to make the experience more personalized. You can choose to remain anonymous if you prefer.'
      },
      {
        id: 'q1_2',
        text: "What's your email?",
        difficulty: 'easy',
        type: 'text_input',
        category: 'personal_info',
        sectionId: 'section_1',
        placeholder: 'To share a copy of the report',
        allowAnonymous: true,
        isInfo: true,
        infoText: 'This is to send you a copy of your assessment report. You can choose to remain anonymous if you prefer.'
      },
      {
        id: 'q1_3',
        text: "Your Age?",
        difficulty: 'easy',
        type: 'text_input',
        category: 'personal_info',
        sectionId: 'section_1',
        placeholder: 'Your age',
        //allowAnonymous: true,
        isInfo: true,
        infoText: 'This helps in tailoring the assessment to your life stage and provides insights into your life philosophy. You can choose to remain anonymous if you prefer.'
      },
      {
        id: 'q1_4',
        text: "What's your gender?",
        difficulty: 'easy',
        type: 'multiple_choice',
        options: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
        category: 'personal_info',
        sectionId: 'section_1',
        isInfo: true,
        infoText: 'This helps in understanding your gender identity and its impact on your life experiences.'
      },
      {
        id: 'q1_5',
        text: "Where have you lived the most in your life?",
        difficulty: 'easy',
        type: 'text_input',
        category: 'personal_info',
        sectionId: 'section_1',
        placeholder: 'Give more context to your upbringing in different locations.  You can write multiple locations and timelines.',
        enableCityAutocomplete: true,
        allowAnonymous: true, 
        isInfo: true,
        infoText: 'This helps in understanding the cultural and environmental influences on your upbringing. You can choose to remain anonymous if you prefer.'
      }
    ]
  },
  {
    id: 'section_2',
    title: 'Grow',
    description: 'To know your roots',
    questions: [
      {
        id: 'q2_1',
        text: "Who did you grow up living with mostly?",
        difficulty: 'easy',
        type: 'text_input',
        category: 'family',
        sectionId: 'section_2',
        allowTags: true,
        placeholder: 'Just like you text a friend. You can write about multiple life stages if needed.',
        isInfo: true,
        infoText: 'This helps in understanding your family dynamics and their influence on your development.'
      },
      {
        id: 'q2_2',
        text: "Is there anything about your childhood or family life you wish was different?",
        difficulty: 'hard',
        type: 'text_input',
        category: 'family',
        sectionId: 'section_2',
        allowTags: true,
        isInfo: true,
        infoText: 'This helps in understanding your family dynamics and their influence on your development.',
        placeholder: 'You can write more than 1 thing if you want. Even a small change you would have liked is helpful.'
      },
      {
        id: 'q2_3',
        text: "Who in your family do you fight with or disagree with the most? Why?",
        difficulty: 'easy',
        type: 'text_input',
        category: 'family',
        sectionId: 'section_2',
        allowTags: true,
        isInfo: true,
        infoText: 'This helps in understanding your family dynamics and their influence on your development.',
        placeholder: 'More context will increase the accuracy of my analysis.'
      }
    ]
  },
  {
    id: 'section_3',
    title: 'Values',
    description: 'Understanding your priorities and aspirations',
    questions: [
      {
        id: 'q3_1',
        text: "What is your highest priority goal for this year/month?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'goals',
        sectionId: 'section_3',
        allowTags: true,
        isInfo: true,
        infoText: 'This helps in understanding your goals and aspirations.',
        placeholder: 'Basically what you are looking forward to achieve. You can write more than 1 thing.'
      },
      {
        id: 'q3_2',
        text: "What matters the most to you? Write one sentence explaining why your top choice is most important.",
        difficulty: 'hard',
        type: 'ranking',
        options: ['Being Known/Respected', 'Family', 'Money', 'Peace'],
        category: 'values',
        sectionId: 'section_3',
        allowTags: true,
        isInfo: true,
        infoText: 'This helps in understanding your core values and what drives your decisions.',
        additionalInput: {
          type: 'text_input',
          label: 'Explain why your top choice is most important to you'
        }
      },
      {
        id: 'q3_3',
        text: "If you could magically get 3 things in life right now, what would you ask for?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'desires',
        sectionId: 'section_3',
        isInfo: true,
        infoText: 'This helps in understanding your desires and what you value in life.',
        allowTags: true,
        placeholder: 'Think of anything— “Ability to fly”, “Meeting with Jeff Bezos”, “CEO of Google”, “I have everything I want, I don’t need anything”, “A pet named Jaws”'
      },
      {
        id: 'q3_4',
        text: "What's something you feel you understand better than most people around you?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'self_perception',
        sectionId: 'section_3',
        allowTags: true,
        isInfo: true,
        infoText: 'This helps in understanding your self-perception and unique strengths.',
        placeholder: 'It can be anything— “I am better at solving Rubics Cube”, “Reading People’s emotions”, “Financial Modelling”, “Critical thinking”, “Building Profitable Businesses”, “Pokemon Go cards”'
      },
      {
        id: 'q3_5',
        text: "If you could become the best in the world at one thing, what would it be? And what would you do after becoming the best?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'ambition',
        sectionId: 'section_3',
        allowTags: true,
        isInfo: true,
        infoText: 'This helps in understanding your ambitions and long-term vision.',
        placeholder: 'Again, Anything you can think of.'
      },
      {
        id: 'q3_6',
        text: "Who's someone (alive or not) that really inspires you? What is it about them that connects with you personally?",
        difficulty: 'hard',
        type: 'text_input',
        category: 'inspiration',
        sectionId: 'section_3',
        allowTags: true,
        isInfo: true,
        infoText: 'This helps in understanding your sources of inspiration and what qualities you admire.',
        placeholder: 'It can be a celebrity, family member, fictional character, or even a friend.'
      }
    ]
  },
  {
    id: 'section_4',
    title: 'Behavior',
    description: 'Understanding your habits and emotional responses',
    questions: [
      {
        id: 'q4_1',
        text: "What's a habit you have that others say is bad, But you feel it's helping you in some way?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'habits',
        sectionId: 'section_4',
        isInfo: true,
        infoText: 'This helps in understanding your habits and their impact on your life.',
        placeholder: 'Examples: Sleeping late, overthinking, isolating, being blunt, etc.'
      },
      {
        id: 'q4_2',
        text: "Is there something you do regularly that you know is not good for you, but you can't or don't want to stop?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'habits',
        sectionId: 'section_4',
        isInfo: true,
        infoText: 'This helps in understanding your habits and their impact on your life.',
        placeholder: 'Be honest to yourself. It can be small or big.'
      },
      {
        id: 'q4_3',
        text: "What's one emotion you find hard to show others? Why do you think that is?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'emotions',
        sectionId: 'section_4',
        isInfo: true,
        infoText: 'This helps in understanding your emotional responses and how you manage them.',
        placeholder: 'Examples: Sadness, jealousy, fear, anger, softness, etc.'
      },
      {
        id: 'q4_4',
        text: "Are you proud of yourself as a person right now?",
        difficulty: 'hard',
        type: 'text_input',
        category: 'self_perception',
        sectionId: 'section_4',
        allowTags: true,
        isInfo: true,
        infoText: 'This helps in understanding your self-perception and areas for growth.',
        placeholder: 'If yes, what makes you proud? If no, what’s missing?'
      }
    ]
  },
  {
    id: 'section_5',
    title: 'Identity',
    description: 'Understanding how you see yourself and how others see you',
    questions: [
      {
        id: 'q5_1',
        text: "How do you think your close friends describe you when you're not around?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'self_perception',
        sectionId: 'section_5',
        allowTags: true,
        isInfo: true,
        infoText: 'This helps in understanding your self-perception and how it aligns with others\' views of you.',
        placeholder: 'Try to guess as honestly as possible.'
      },
      {
        id: 'q5_2',
        text: "If you had to describe your personality in one sentence, what would you say?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'self_perception',
        sectionId: 'section_5',
        allowTags: true,
        isInfo: true,
        infoText: 'This helps in understanding your self-perception and how you view your own identity.',
        placeholder: 'Think of how you would explain yourself to someone you are meeting for the first time. '
      },
      {
        id: 'q5_3',
        text: "What's something you wish people understood about you more clearly?",
        difficulty: 'medium',
        type: 'text_input',
        category: 'self_perception',
        sectionId: 'section_5',
        allowTags: true,
        isInfo: true,
        infoText: 'This helps in understanding your self-perception and areas where you feel misunderstood.',
        placeholder: 'Detailed answer will improve the analysis.'
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