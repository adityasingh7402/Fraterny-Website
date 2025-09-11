import React, {useState} from 'react';
import { motion } from 'framer-motion';
import { useQuest } from '../core/useQuest';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getWordValidationStatus } from '../utils/questValidation';
import { HonestyTag } from '../core/types';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';

interface QuestNavigationProps {
  showPrevious?: boolean;
  showNext?: boolean;
  showSkip?: boolean;
  showFinish?: boolean;
  onFinish?: () => void;
  className?: string;
}

/**
 * Navigation controls for the quest system
 * Provides buttons for navigating between questions and sections
 */
export function QuestNavigation({
  showPrevious = true,
  showNext = true,
  showSkip = true,
  showFinish = true,
  onFinish,
  className = ''
}: QuestNavigationProps) {
  const { 
  session, 
  currentQuestion,
  questions,
  allQuestions,
  currentSection,
  nextQuestion,
  previousQuestion,
  submitResponse,
  changeSection,
  sections,           // ADD this
  currentSectionId,
  finishQuest,
  trackQuestionView,
  stopQuestionTracking
  } = useQuest();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStartedSubmission, setHasStartedSubmission] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const posthog = usePostHog();

  const formatSubmissionData = () => {
    const fallbackSessionId = crypto.getRandomValues(new Uint8Array(16)).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    const workingSession = { 
      id: session?.id || fallbackSessionId, 
      userId: auth.user?.id || 'anonymous', 
      startedAt: session?.startedAt || new Date().toISOString(), 
      responses: session?.responses || {},
      status: 'completed'
    };

    const testid = crypto.getRandomValues(new Uint8Array(20)).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    
    const userData = auth.user?.id ? {
      user_id: auth.user.id,
      name: auth.user.user_metadata?.first_name 
        ? `${auth.user.user_metadata.first_name} ${auth.user.user_metadata.last_name || ''}`
        : 'User',
      email: auth.user.email || 'user@example.com',
      "mobile no": auth.user.user_metadata?.phone || "",
      city: auth.user.user_metadata?.city || "",
      DOB: auth.user.user_metadata?.dob || undefined,
      "testid": testid
    } : {
      user_id: `${workingSession?.userId || 'unknown'}`,
      name: 'Anonymous User',
      email: '',
      "mobile no": '',
      city: '',
      DOB: undefined,
      "testid": testid
    };
    
    const startTime = workingSession?.startedAt;
    const completionTime = new Date().toISOString();
    const startTimeValue = startTime || new Date().toISOString();
    const durationMinutes = (new Date().getTime() - new Date(startTimeValue).getTime()) / (1000 * 60);
    
    let previousTimestamp: string | null = null;
    const responses = allQuestions?.map((question, index) => {
      const response = workingSession?.responses?.[question.id];
      const sectionId = question?.sectionId || '';
      const sectionName = sections?.find(s => s.id === sectionId)?.title || '';
      
      if (response) {
        let timeTaken = null;
        if (previousTimestamp) {
          const currentTime = new Date(response.timestamp).getTime();
          const prevTime = new Date(previousTimestamp).getTime();
          const diffSeconds = Math.round((currentTime - prevTime) / 1000);
          timeTaken = `${diffSeconds}s`;
        }
        previousTimestamp = response.timestamp;
        
        return {
          qno: index + 1,
          question_id: question.id,
          question_text: question?.text || '',
          answer: response.response,
          section_id: sectionId,
          section_name: sectionName,
          metadata: {
            tags: response.tags || [],
            time_taken: timeTaken || (question?.type === 'date_input' ? '1s' : undefined)
          }
        };
      } else {
        return {
          qno: index + 1,
          question_id: question.id,
          question_text: question?.text || '',
          answer: "I preferred not to response for this question",
          section_id: sectionId,
          section_name: sectionName,
          metadata: {
            tags: [],
            time_taken: '1s'
          }
        };
      }
    }) || [];
    
    const tagCounts: Record<string, number> = {};
    responses.forEach(response => {
      if (response.metadata.tags) {
        response.metadata.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    const allTags = ['Honest', 'Unsure', 'Sarcastic', 'Avoiding'];
    allTags.forEach(tag => {
      if (!tagCounts[tag]) tagCounts[tag] = 0;
    });
    
    const detectDeviceType = (): string => {
      const userAgent = navigator.userAgent;
      if (/mobile|android|iphone|ipad|ipod/i.test(userAgent.toLowerCase())) {
        return /ipad/i.test(userAgent.toLowerCase()) ? 'tablet' : 'mobile';
      }
      return 'desktop';
    };
    
    const detectBrowser = (): string => {
      const userAgent = navigator.userAgent;
      if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
      if (userAgent.indexOf('Safari') > -1) return 'Safari';
      if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
      if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) return 'Internet Explorer';
      if (userAgent.indexOf('Edge') > -1) return 'Edge';
      return 'Unknown';
    };
    
    const detectOS = (): string => {
      const userAgent = navigator.userAgent;
      if (userAgent.indexOf('Windows') > -1) return 'Windows';
      if (userAgent.indexOf('Mac') > -1) return 'Mac';
      if (userAgent.indexOf('Linux') > -1) return 'Linux';
      if (userAgent.indexOf('Android') > -1) return 'Android';
      if (userAgent.indexOf('iOS') > -1) return 'iOS';
      return 'Unknown';
    };

    // Try to get device backup info for fallback recovery (secondary method)
    let deviceBackup = null;
    try {
      const stored = localStorage.getItem('fraterny_device_backup');
      if (stored) {
        deviceBackup = JSON.parse(stored);
      }
    } catch (e) {
      console.log('Could not retrieve device backup (non-critical)');
    }

    
    return {
      response: responses,
      user_data: userData,
      assessment_metadata: {
        session_id: workingSession?.id || '',
        start_time: startTime,
        completion_time: completionTime,
        duration_minutes: Number(durationMinutes.toFixed(1)),
        completion_percentage: Math.round((Object.keys(workingSession?.responses || {}).length / (allQuestions?.length || 1)) * 100),
        device_info: {
          type: detectDeviceType(),
          browser: detectBrowser(),
          operating_system: detectOS()
        },
        device_identifier: deviceBackup ? {
          ip: deviceBackup.ip,
          deviceHash: deviceBackup.deviceHash
        } : null,
      }
    };
  };

  const isLastQuestionInSection = session && 
  questions.length > 0 && 
  session.currentQuestionIndex === questions.length - 1;

  const isLastQuestionInEntireAssessment = () => {
    if (!session || !currentSection) return false;
    
    // Check if current section is the last section
    const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
    const isLastSection = currentSectionIndex === sections.length - 1;
    
    // Check if current question is last in this section
    const isLastQuestionInThisSection = session.currentQuestionIndex === questions.length - 1;
    
    return isLastSection && isLastQuestionInThisSection;
  };

  const isLastQuestion = isLastQuestionInEntireAssessment();

  const isFirstQuestionInEntireAssessment = () => {
  if (!session) return true;
  
  // Get current section index
  const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
  
  // If we're in the first section AND on the first question of that section
  const isFirstSection = currentSectionIndex === 0;
  const isFirstQuestionInThisSection = session.currentQuestionIndex === 0;
  
  return isFirstSection && isFirstQuestionInThisSection;
  };

const isFirstQuestion = isFirstQuestionInEntireAssessment();

const checkForUnfinishedQuestions = () => {

  // const unfinishedQuestions = allQuestions?.filter(question => {
  //   const response = session?.responses?.[question.id];
  //   return !response; // No response = unfinished
  // }) || [];

  const unfinishedQuestions = allQuestions?.filter(question => {
  const response = session?.responses?.[question.id];
  
  // If no response in session, check if current question has DOM value
  if (!response && question.id === currentQuestion?.id) {
    // Check current DOM state for this question with proper type casting
    const currentTextarea = document.querySelector('textarea') as HTMLTextAreaElement;
    const currentInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    const currentRadio = document.querySelector(`input[name="question-${question.id}"]:checked`) as HTMLInputElement;
    
    const hasCurrentValue = (currentTextarea && currentTextarea.value.trim()) || 
                           (currentInput && currentInput.value.trim()) || 
                           currentRadio;
    
    return !hasCurrentValue; // Has current value = not unfinished
  }
  
  return !response; // No response = unfinished
}) || [];
  
  if (unfinishedQuestions.length > 0) {
    const firstUnfinishedQuestion = unfinishedQuestions[0];
    const sectionId = firstUnfinishedQuestion?.sectionId;
    const sectionName = sections?.find(s => s.id === sectionId)?.title || 'Unknown Section';
    
    return {
      hasUnfinished: true,
      sectionName: sectionName,
      count: unfinishedQuestions.length
    };
  }
  
  return { hasUnfinished: false };
};

const handleNext = async () => {
  if (currentQuestion) {
    
    const getSelectedTagsFromQuestionCard = (): HonestyTag[] => {
      try {
        const saved = localStorage.getItem(`quest_tags_${currentQuestion.id}`);
        if (saved) {
          const tags = JSON.parse(saved);
          // console.log('🏷️ Navigation found saved tags in localStorage:', { questionId: currentQuestion.id, tags });
          return tags;
        }
      } catch (error) {
        console.error('Failed to load tags from localStorage:', error);
      }
      
      // Fallback: Try to read from DOM if localStorage approach doesn't work
      const tagButtons = document.querySelectorAll('[data-tag-selected="true"]');
      const selectedTags: HonestyTag[] = [];
      
      tagButtons.forEach(button => {
        const tagValue = button.getAttribute('data-tag-value') as HonestyTag;
        if (tagValue) {
          selectedTags.push(tagValue);
        }
      });
      
      // console.log('🏷️ Navigation found tags from DOM:', { questionId: currentQuestion.id, selectedTags });
      return selectedTags;
    };

    if (currentQuestion.type === 'text_input') {
      const currentTextarea = document.querySelector('textarea');
      if (currentTextarea && currentTextarea.value) {
        // Get the selected tags
        const selectedTags = getSelectedTagsFromQuestionCard();
        
        // console.log('💾 Navigation saving text response with tags:', {
        //   questionId: currentQuestion.id,
        //   response: currentTextarea.value,
        //   tags: selectedTags
        // });
        
        // Submit response with tags
        await submitResponse(currentQuestion.id, currentTextarea.value, selectedTags);
      }
    } 
    else if (currentQuestion.type === 'multiple_choice') {
      // Handle multiple choice questions
      const selectedRadio = document.querySelector(`input[name="question-${currentQuestion.id}"]:checked`) as HTMLInputElement;
      if (selectedRadio) {
        const selectedTags = getSelectedTagsFromQuestionCard();
        
        console.log('💾 Navigation saving multiple choice response with tags:', {
          questionId: currentQuestion.id,
          response: selectedRadio.value,
          tags: selectedTags
        });
        
        submitResponse(currentQuestion.id, selectedRadio.value, selectedTags);
      }
    }
    else if (currentQuestion.type === 'ranking') {
      // Handle ranking questions - SIMPLE APPROACH
      // Ranking order is already saved on drag, we just need to save explanation
      const rankingContainer = document.querySelector('.ranking-response');
      if (rankingContainer) {
        const explanationTextarea = rankingContainer.querySelector('textarea');
        const explanation = explanationTextarea ? explanationTextarea.value : '';
        
        // Get existing response (which has the ranking order from drag events)
        const existingResponse = session?.responses?.[currentQuestion.id]?.response;
        
        if (existingResponse) {
          try {
            // Parse existing response and update explanation
            const existingData = JSON.parse(existingResponse);
            existingData.explanation = explanation;
            
            // Get selected tags
            const selectedTags = getSelectedTagsFromQuestionCard();
            
            console.log('💾 Navigation saving ranking response with tags:', {
              questionId: currentQuestion.id,
              data: existingData,
              tags: selectedTags
            });
            
            // Save updated response with new explanation and tags
            submitResponse(currentQuestion.id, JSON.stringify(existingData), selectedTags);
          } catch (e) {
            // Fallback: create new response if parsing fails
            const fallbackData = JSON.stringify({
              rankings: (currentQuestion.options || []).map((text, index) => ({
                id: `option-${index}`,
                text: text
              })),
              explanation: explanation
            });
            
            const selectedTags = getSelectedTagsFromQuestionCard();
            submitResponse(currentQuestion.id, fallbackData, selectedTags);
          }
        } else if (explanation) {
          // No existing response but has explanation - save basic structure
          const basicData = JSON.stringify({
            rankings: (currentQuestion.options || []).map((text, index) => ({
              id: `option-${index}`,
              text: text
            })),
            explanation: explanation
          });
          
          const selectedTags = getSelectedTagsFromQuestionCard();
          submitResponse(currentQuestion.id, basicData, selectedTags);
        }
      }
    }
    else if (currentQuestion.type === 'date_input') {
      // Try to find MUI DatePicker input first
    const currentDateInput = document.querySelector('input[placeholder*="date of birth"]') as HTMLInputElement ||
                            document.querySelector('.MuiInputBase-input') as HTMLInputElement ||
                            document.querySelector('input[type="date"]') as HTMLInputElement;
      console.log('💾 Date input value:', currentDateInput?.value);
      console.log('💾 Date input value:', currentDateInput?.value);
      // Add this new one:
      console.log('🔍 All inputs on page:', document.querySelectorAll('input'));
      if (currentDateInput && currentDateInput.value) {
        const selectedTags = getSelectedTagsFromQuestionCard();
        console.log('💾 Navigation saving date response with tags:', {
          questionId: currentQuestion.id,
          response: currentDateInput.value,
          tags: selectedTags
        });
        submitResponse(currentQuestion.id, currentDateInput.value, selectedTags);
      }
    }
    else {
      // For any other question type, still try to save tags if they exist
      const selectedTags = getSelectedTagsFromQuestionCard();
      if (selectedTags.length > 0) {
        console.log('💾 Navigation saving tags for other question type:', {
          questionId: currentQuestion.id,
          type: currentQuestion.type,
          tags: selectedTags
        });
        
        // Save with empty response but include tags
        submitResponse(currentQuestion.id, '', selectedTags);
      }
    }
  }

  // Check validation for text questions before proceeding
  if (currentQuestion?.type === 'text_input' && session?.responses?.[currentQuestion.id]) {
    const response = session.responses[currentQuestion.id].response;
    const wordValidation = getWordValidationStatus(response, 100, 90);
    
    if (!wordValidation.isValid) {
      return;
    }
  }
  
  // without checking of all questions answered
  if (isLastQuestionInSection) {
    // Always move to next section, ignore validation
    const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
    const nextSectionIndex = currentSectionIndex + 1;
    
    if (nextSectionIndex < sections.length) {
      // Move to next section directly
      const nextSection = sections[nextSectionIndex];
      changeSection(nextSection.id);
    } else if (showFinish) {
      if (onFinish) {
        // onFinish();
        // setShowConfirmation(true);
      } else if (showFinish) {
        if (onFinish) {
          const unfinishedCheck = checkForUnfinishedQuestions();
          console.log('🔍 Unfinished questions check:', unfinishedCheck);
             
          if (unfinishedCheck.hasUnfinished) {
            toast.error(`Please complete all questions in the section "${unfinishedCheck.sectionName}" before finishing. Unfinished questions: ${unfinishedCheck.count}`
              ,{
                position: 'top-center',
              }
            );
            return; // Don't proceed
          }
          
          setShowConfirmation(true);
        }
      } 
      else {
        // finishQuest();
        console.warn('No onFinish callback provided - cannot finish quest without submission data');
      }
    }
  } else {
    nextQuestion();
  }

  // check if user has answered all questions in the section

    // Check if user has answered all questions before proceeding
if (isLastQuestionInSection) {
  const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
  const nextSectionIndex = currentSectionIndex + 1;
  
  if (nextSectionIndex < sections.length) {
    // Move to next section directly
    const nextSection = sections[nextSectionIndex];
    changeSection(nextSection.id);
  } else if (showFinish) {
    // Last section, check for unfinished questions first
    if (onFinish) {
      const unfinishedCheck = checkForUnfinishedQuestions();
      console.log('🔍 Unfinished questions check:', unfinishedCheck);
            
      if (unfinishedCheck.hasUnfinished) {
        toast.error(`Please complete all questions before finishing the assessment.`,
          {
            position: 'top-center',
          }
        );
        return; // Don't proceed - THIS PREVENTS THE CONFIRMATION DIALOG
      }
      
      setShowConfirmation(true); // Only show if all questions are answered
    } else {
      console.warn('No onFinish callback provided - cannot finish quest without submission data');
      }
    }
  } else {
    nextQuestion();
}
};

const handlePrevious = () => {
  if (currentQuestion) {
    // Copy the exact same response-saving logic from handleNext()
    const getSelectedTagsFromQuestionCard = (): HonestyTag[] => {
      try {
        const saved = localStorage.getItem(`quest_tags_${currentQuestion.id}`);
        if (saved) {
          const tags = JSON.parse(saved);
          return tags;
        }
      } catch (error) {
        console.error('Failed to load tags from localStorage:', error);
      }
      
      const tagButtons = document.querySelectorAll('[data-tag-selected="true"]');
      const selectedTags: HonestyTag[] = [];
      
      tagButtons.forEach(button => {
        const tagValue = button.getAttribute('data-tag-value') as HonestyTag;
        if (tagValue) {
          selectedTags.push(tagValue);
        }
      });
      
      return selectedTags;
    };

    // Save current response before going back (copy from handleNext)
    if (currentQuestion.type === 'text_input') {
      const currentTextarea = document.querySelector('textarea') as HTMLTextAreaElement;
      if (currentTextarea && currentTextarea.value) {
        const selectedTags = getSelectedTagsFromQuestionCard();
        submitResponse(currentQuestion.id, currentTextarea.value, selectedTags);
      }
    } 
    else if (currentQuestion.type === 'multiple_choice') {
      const selectedRadio = document.querySelector(`input[name="question-${currentQuestion.id}"]:checked`) as HTMLInputElement;
      if (selectedRadio) {
        const selectedTags = getSelectedTagsFromQuestionCard();
        submitResponse(currentQuestion.id, selectedRadio.value, selectedTags);
      }
    }
    // Add other question types as needed (copy from handleNext)
  }

  // After saving, navigate to previous question
  previousQuestion();
};


const handleConfirmSubmission = async () => {
  if (hasStartedSubmission || isSubmitting || isSubmitted) {
    console.log('Submission already in progress, ignoring click');
    return;
  }
  setHasStartedSubmission(true);
  setIsSubmitting(true);
  setSubmissionError(null);
  
  try {
    console.log('🚀 Starting quest submission from confirmation...');
    
    // Format submission data
    const submissionData = formatSubmissionData();
    console.log('📊 Submission data created:', submissionData ? 'SUCCESS' : 'FAILED');
    
    if (!submissionData) {
      throw new Error('No submission data available');
    }

    const sessionId = submissionData.assessment_metadata.session_id;
    const testid = submissionData?.user_data?.testid || '';
    console.log('🆔 Session ID:', sessionId, 'Test ID:', testid);
    posthog.capture('confirm_button_clicked', {
      testid: testid,
      user_id: auth.user?.id || 'anonymous',
      session_id: submissionData?.assessment_metadata?.session_id || 'unknown',
      timestamp: new Date().toISOString()
    });
    
    // Call finishQuest with submission data
    const result = await finishQuest(submissionData);

    
    console.log('✅ Quest submission completed successfully:', result);
    
    // Show success state
    setIsSubmitted(true);
    
    // Show success toast
    toast.success('Quest submission successful', {
      position: 'top-center',
    });
    
    // Small delay to show success state, then navigate
    setTimeout(() => {
      setShowConfirmation(false);
      if (result?.navigationData?.targetUrl) {
        console.log('🧭 Navigating to:', result.navigationData.targetUrl);
        navigate(result.navigationData.targetUrl);
      }
    }, 1000);
    
  } catch (error: any) {
    setHasStartedSubmission(false);
    console.error('❌ Submission failed:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Submission failed';
    setSubmissionError(errorMessage);
    setIsSubmitted(false);
  } finally {
    setIsSubmitting(false);
  }
};


const handleCancelSubmission = () => {
  setShowConfirmation(false);
};
  
  // Button variants
  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    tap: { scale: 0.95 }
  };
  
  return (
    <>
      <nav className={`${className}`}>
        <div className="flex gap-1">

        {showPrevious && (
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className={` ${
              isFirstQuestion
                ? 'hidden'
                : 'w-[70px] h-14 bg-white rounded-full border-2 border-neutral-400 justify-center items-center flex'
            }`}
          >
              <ChevronLeft className={`w-5 h-5 ${isFirstQuestion ? 'hidden' : 'block'}`} />
          </motion.button>
        )}

        {showNext && (
          <motion.button
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            onClick={handleNext}
            className={`px-4 py-2 text-white text-sm font-medium transition-colors ${
              isLastQuestion && showFinish
                ? 'w-4/5 h-14 bg-gradient-to-br from-sky-800 to-sky-400 rounded-[36px] border-2 border-blue-950'
                : 'w-full h-14 bg-gradient-to-br from-sky-800 to-sky-400 rounded-[36px] border-2 border-blue-950'
            }`}
          >
            <div className='flex gap-1 justify-center items-center'>
              <div className="w-auto justify-center text-white text-2xl font-normal font-['Gilroy-Bold'] tracking-[-2px]">
              {isLastQuestion && showFinish ? 'Finish' : 'Next'}
              </div>
              <div className='h-full flex items-center justify-center pt-1'>
                <ChevronRight className='w-[1.5] h-[3]'/>
              </div>
            </div>
          </motion.button>
        )}
      </div>
    </nav>

    {/* {showConfirmation && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
        >
          <div className="text-gray-600 text-xl leading-6 font-['Gilroy-Regular'] mb-4">
            Satisfied with your answers? Press the confirm button to submit your response.
          </div>

          <div className="flex justify-start space-x-3">
            <button
              onClick={handleCancelSubmission}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xl font-normal font-['Gilroy-semiBold'] tracking-[-2px]"
              disabled={isSubmitting}
            >
              Go Back
            </button>
            
            <button
              onClick={handleConfirmSubmission}
              className="px-4 py-2 text-xl font-normal font-['Gilroy-Bold'] tracking-[-1px] bg-gradient-to-br from-sky-800 to-sky-400 text-white rounded-lg hover:opacity-90 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm'}
            </button>
          </div>
        </motion.div>
      </div>
    )} */}
    {showConfirmation && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
        >
          {/* Conditional content based on submission state */}
          {!isSubmitting && !isSubmitted && !submissionError && (
            <>
              <div className="text-gray-600 text-xl leading-6 font-['Gilroy-Regular'] mb-4">
                Satisfied with your answers? Press the confirm button to submit your response.
              </div>

              <div className="flex justify-start space-x-3">
                <button
                  onClick={handleCancelSubmission}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xl font-normal font-['Gilroy-semiBold'] tracking-[-2px]"
                >
                  Go Back
                </button>
                
                <button
                  onClick={handleConfirmSubmission}
                  disabled={hasStartedSubmission || isSubmitting || isSubmitted}
                  className="px-4 py-2 text-xl font-normal font-['Gilroy-Bold'] tracking-[-1px] bg-gradient-to-br from-sky-800 to-sky-400 text-white rounded-lg hover:opacity-90 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </>
          )}

          {/* Submitting state */}
          {isSubmitting && (
            <>
              <div className="text-center py-8">
                <h3 className="text-2xl font-['Gilroy-Bold'] text-navy mb-2">
                  Submitting...
                </h3>
                <p className="text-gray-600 font-['Gilroy-Regular'] text-xl">
                  We are submitting your responses. Please do not close this window.
                </p>
              </div>
            </>
          )}

          {/* Success state */}
          {isSubmitted && !submissionError && (
            <>
              <div className="text-center py-8">
                <h3 className="text-2xl font-['Gilroy-Bold'] text-green-600 mb-2">
                  Submitted Successfully!
                </h3>
                <p className="text-gray-600 font-['Gilroy-Regular']">
                  Our AI is reviewing your responses. You will be redirected shortly.
                </p>
              </div>
            </>
          )}

          {/* Error state */}
          {submissionError && (
            <>
              <div className="text-left py-4">
                <div className="text-black font-['Gilroy-Regular'] text-xl mb-4 p-3 rounded-lg">
                  Due to slow network your submission was not successful last time. Please try again.
                </div>
                
                <div className="flex justify-start space-x-3">
                  <button
                    onClick={handleCancelSubmission}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xl font-normal font-['Gilroy-semiBold'] tracking-[-2px]"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={() => {
                      setSubmissionError(null);
                      setIsSubmitted(false);
                      handleConfirmSubmission();
                    }}
                    className="px-4 py-2 text-xl font-normal font-['Gilroy-Bold'] tracking-[-1px] bg-gradient-to-br from-sky-800 to-sky-400 text-white rounded-lg hover:opacity-90 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    )}
    </>
  );
  };

export default QuestNavigation;