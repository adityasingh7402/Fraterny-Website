"use client"
import React from 'react';;
import { ScreenContainer } from '../../components/quest-landing/sections/index'
import { MotionProvider } from '../../components/quest-landing/animations/index';

const QuestLandingPage: React.FC = () => {
  const handleAnalyzeClick = () => {
    console.log('Analyze Me clicked - you can add your logic here');
    // Add any additional logic you need when the button is clicked
  };

  return (
    <MotionProvider>
        <ScreenContainer 
          onAnalyzeClick={handleAnalyzeClick}
          className=""
        />
    </MotionProvider>
  );
};

export default QuestLandingPage;