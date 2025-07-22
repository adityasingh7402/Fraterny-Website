// // /src/components/quest-landing/common/Button.tsx

// import React from 'react';
// import { motion } from 'framer-motion';
// import { colors, typography, spacing } from '../styles';
// import { buttonHover, buttonTap } from '../styles/animations';

// interface ButtonProps {
//   children: React.ReactNode;
//   variant?: 'primary' | 'secondary' | 'outline';
//   size?: 'small' | 'medium' | 'large' | 'hero';
//   onClick?: () => void;
//   disabled?: boolean;
//   className?: string;
//   animated?: boolean;
//   type?: 'button' | 'submit' | 'reset';
// }

// const Button: React.FC<ButtonProps> = ({
//   children,
//   variant = 'primary',
//   size = 'hero',
//   onClick,
//   disabled = false,
//   className = '',
//   animated = true,
//   type = 'button'
// }) => {
//   // Get button dimensions based on size
//   const getButtonStyles = () => {
//     switch (size) {
//       case 'hero':
//         return {
//           width: spacing.button.primary.width,      // 160px
//           height: spacing.button.primary.height,    // 60px
//           borderRadius: spacing.button.primary.borderRadius, // 30px
//           fontSize: '16px',
//           padding: '0 24px'
//         };
//       case 'large':
//         return {
//           width: '140px',
//           height: '50px',
//           borderRadius: '25px',
//           fontSize: '15px',
//           padding: '0 20px'
//         };
//       case 'medium':
//         return {
//           width: '120px',
//           height: '44px',
//           borderRadius: '22px',
//           fontSize: '14px',
//           padding: '0 16px'
//         };
//       case 'small':
//         return {
//           width: '100px',
//           height: '36px',
//           borderRadius: '18px',
//           fontSize: '13px',
//           padding: '0 12px'
//         };
//       default:
//         return {
//           width: spacing.button.primary.width,
//           height: spacing.button.primary.height,
//           borderRadius: spacing.button.primary.borderRadius,
//           fontSize: '16px',
//           padding: '0 24px'
//         };
//     }
//   };

//   // Get button variant styles
//   const getVariantStyles = () => {
//     switch (variant) {
//       case 'primary':
//         return {
//           backgroundColor: colors.button.background.primary,
//           border: `${spacing.button.primary.borderWidth} solid ${colors.button.border}`,
//           color: colors.button.text,
//           backdropFilter: 'blur(10px)',
//         };
//       case 'secondary':
//         return {
//           backgroundColor: 'rgba(255, 255, 255, 0.05)',
//           border: `2px solid rgba(255, 255, 255, 0.3)`,
//           color: colors.text.primary,
//           backdropFilter: 'blur(10px)',
//         };
//       case 'outline':
//         return {
//           backgroundColor: 'transparent',
//           border: `2px solid ${colors.button.border}`,
//           color: colors.text.primary,
//         };
//       default:
//         return {
//           backgroundColor: colors.button.background.primary,
//           border: `${spacing.button.primary.borderWidth} solid ${colors.button.border}`,
//           color: colors.button.text,
//           backdropFilter: 'blur(10px)',
//         };
//     }
//   };

//   const buttonStyles = getButtonStyles();
//   const variantStyles = getVariantStyles();

//   // Base button style
//   const baseStyle = {
//     width: buttonStyles.width,
//     height: buttonStyles.height,
//     borderRadius: buttonStyles.borderRadius,
//     fontSize: buttonStyles.fontSize,
//     padding: buttonStyles.padding,
//     fontFamily: typography.fontFamily.bold,
//     fontWeight: typography.button.primary.fontWeight,
//     letterSpacing: typography.button.primary.letterSpacing,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     cursor: disabled ? 'not-allowed' : 'pointer',
//     transition: 'all 0.3s ease',
//     outline: 'none',
//     ...variantStyles,
//     opacity: disabled ? 0.5 : 1,
//   };

//   // Hover styles
//   const hoverStyle = {
//     backgroundColor: disabled 
//       ? variantStyles.backgroundColor 
//       : colors.button.background.hover,
//     transform: disabled ? 'none' : 'translateY(-1px)',
//     boxShadow: disabled 
//       ? 'none' 
//       : '0 8px 25px rgba(12, 69, 240, 0.3)',
//   };

//   const ButtonContent = () => (
//     <button
//       type={type}
//       onClick={disabled ? undefined : onClick}
//       className={`relative overflow-hidden ${className}`}
//       style={baseStyle}
//       onMouseEnter={(e) => {
//         if (!disabled) {
//           Object.assign(e.currentTarget.style, hoverStyle);
//         }
//       }}
//       onMouseLeave={(e) => {
//         if (!disabled) {
//           Object.assign(e.currentTarget.style, {
//             backgroundColor: variantStyles.backgroundColor,
//             transform: 'translateY(0)',
//             boxShadow: 'none',
//           });
//         }
//       }}
//       disabled={disabled}
//     >
//       {/* Subtle shimmer effect */}
//       <div 
//         className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300"
//         style={{
//           background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
//           transform: 'translateX(-100%)',
//           animation: 'shimmer 2s ease-in-out infinite',
//         }}
//       />
      
//       {/* Button text */}
//       <span className="relative z-10">
//         {children}
//       </span>
//     </button>
//   );

//   if (animated && !disabled) {
//     return (
//       <motion.div
//         whileHover={buttonHover}
//         whileTap={buttonTap}
//         className="inline-block"
//       >
//         <ButtonContent />
//       </motion.div>
//     );
//   }

//   return <ButtonContent />;
// };

// export default Button;

// /src/components/quest-landing/common/Button.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large' | 'hero';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  animated?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// Simple animation variants like Code 1
const buttonHover = {
  scale: 1.05,
  transition: {
    duration: 0.2,
  }
};

const buttonTap = {
  scale: 0.95,
  transition: {
    duration: 0.1,
  }
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'hero',
  onClick,
  disabled = false,
  className = '',
  animated = true,
  type = 'button'
}) => {
  // Get button dimensions based on size
  const getButtonStyles = () => {
    switch (size) {
      case 'hero':
        return {
          width: '160px',
          height: '60px',
          borderRadius: '30px',
          fontSize: '16px',
          padding: '0 24px'
        };
      case 'large':
        return {
          width: '140px',
          height: '50px',
          borderRadius: '25px',
          fontSize: '15px',
          padding: '0 20px'
        };
      case 'medium':
        return {
          width: '120px',
          height: '44px',
          borderRadius: '22px',
          fontSize: '14px',
          padding: '0 16px'
        };
      case 'small':
        return {
          width: '100px',
          height: '36px',
          borderRadius: '18px',
          fontSize: '13px',
          padding: '0 12px'
        };
      default:
        return {
          width: '160px',
          height: '60px',
          borderRadius: '30px',
          fontSize: '16px',
          padding: '0 24px'
        };
    }
  };

  // Get button variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          color: '#FFFFFF',
          backdropFilter: 'blur(10px)',
        };
      case 'secondary':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          color: '#FFFFFF',
          backdropFilter: 'blur(10px)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          color: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          color: '#FFFFFF',
          backdropFilter: 'blur(10px)',
        };
    }
  };

  const buttonStyles = getButtonStyles();
  const variantStyles = getVariantStyles();

  // Base button style
  const baseStyle = {
    ...buttonStyles,
    fontFamily: 'Gilroy-Bold, sans-serif',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    ...variantStyles,
    opacity: disabled ? 0.5 : 1,
  };

  const ButtonContent = () => (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={`relative overflow-hidden ${className}`}
      style={baseStyle}
      disabled={disabled}
    >
      {/* Button text */}
      <span className="relative z-10">
        {children}
      </span>
    </button>
  );

  if (animated && !disabled) {
    return (
      <motion.div
        whileHover={buttonHover}
        whileTap={buttonTap}
        className="inline-block"
      >
        <ButtonContent />
      </motion.div>
    );
  }

  return <ButtonContent />;
};

export default Button;
