import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UrlParams {
  userId: string;
  testId: string;
  sessionId: string;
}

interface StarIconProps {
  filled: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface IconProps {
  className?: string;
}

const QuestPaidFeedback: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [urlParams, setUrlParams] = useState<UrlParams>({
    userId: '',
    testId: '',
    sessionId: ''
  });

  // Extract URL parameters
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    setUrlParams({
      userId: urlSearchParams.get('user_id') || '',
      testId: urlSearchParams.get('testid') || '',
      sessionId: urlSearchParams.get('session_id') || urlSearchParams.get('user_id') || ''
    });
  }, []);

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        userId: urlParams.userId,
        sessionId: urlParams.sessionId,
        testId: urlParams.testId,
        rating: rating,
        feedback: feedback
      };

      console.log('Submitting feedback:', payload);

    //   const response = await fetch('/api/quest/paid/feedback', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(payload)
    //   });

      // use axios instead of fetch 
      const response = await axios.post('https://api.fraterny.in/quest-paid-feedback/', payload);

      if (response.status !== 200) {
        throw new Error('Failed to submit feedback');
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Star Icon Component
  const StarIcon: React.FC<StarIconProps> = ({ filled, className, onClick, onMouseEnter, onMouseLeave }) => (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`p-2 rounded-full transition-all duration-200 hover:bg-white hover:bg-opacity-10 ${className || ''}`}
    >
      <svg
        className={`w-8 h-8 transition-all duration-200 ${
          filled
            ? 'text-yellow-300 fill-yellow-300 scale-110' 
            : 'text-white text-opacity-50 hover:text-opacity-70'
        }`}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  );

  const SendIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );

  const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen" style={{
        background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)'
      }}>
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-md">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl p-8 text-center">
              <div className="mb-6">
                <CheckCircleIcon className="w-16 h-16 mx-auto text-white mb-4" />
                <h2 className="text-2xl text-white mb-2 font-bold">
                  Thank You!
                </h2>
                <p className="text-lg text-white text-opacity-90">
                  Your feedback has been submitted successfully.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-4 mb-6">
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-6 h-6 ${
                        star <= rating 
                          ? 'text-yellow-300 fill-yellow-300' 
                          : 'text-white text-opacity-30'
                      }`}
                      fill={star <= rating ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  ))}
                </div>
                <p className="text-white text-sm">
                  Rating: {rating}/5 stars
                </p>
              </div>

              <p className="text-white text-opacity-80 text-sm">
                Your insights help us improve our service for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)'
    }}>
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl text-white mb-2 font-bold">
                Rate Your Experience
              </h1>
              <p className="text-lg text-white text-opacity-90">
                Help us improve our quest
              </p>
            </div>

            {/* Star Rating */}
            <div className="mb-8">
              <h3 className="text-xl text-white mb-4 text-center font-bold">
                How would you rate your experience?
              </h3>
              
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    filled={star <= (hoverRating || rating)}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
              
              {/* <div className="text-center">
                <p className="text-white text-opacity-80 text-sm">
                  {rating > 0 ? `${rating} out of 5 stars` : 'Tap a star to rate'}
                </p>
              </div> */}
            </div>

            {/* Feedback Text */}
            <div className="mb-8">
              <label className="block text-lg text-white mb-3 font-bold">
                Share your thoughts 
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience with the quest service..."
                rows={4}
                className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-60 text-base focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-white focus:border-opacity-50 outline-none transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className={`w-full h-14 rounded-2xl text-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
                rating === 0 || isSubmitting
                  ? 'bg-white bg-opacity-20 text-white text-opacity-50 cursor-not-allowed'
                  : 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border-2 border-white border-opacity-80 text-white hover:bg-opacity-30 hover:scale-105 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestPaidFeedback;
