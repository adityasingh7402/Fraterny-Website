// src/pages/quest/QuestIndex.tsx

import React from 'react';
import QuestLayout from '../../components/quest/layout/QuestLayout';
import { QuestProvider } from '../../components/quest/core/QuestProvider';
import { useAuth } from '../../contexts/AuthContext';

const QuestResultIndex: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <QuestProvider>
      <QuestLayout showHeader={true} showNavigation={true}>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-playfair text-navy mb-6">Psychology Assessment</h1>
          <p className="text-gray-600 mb-8">
            Welcome to the Fraterny Psychology Assessment. This assessment will help you gain valuable insights about yourself.
          </p>
          
          {/* Assessment starting point would go here */}
          {/* This would typically include your QuestIntro component */}
        </div>
      </QuestLayout>
    </QuestProvider>
  );
};

export default QuestResultIndex;