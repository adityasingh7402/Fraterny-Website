// import React from 'react';

// interface ProfileLayoutProps {
//   children: React.ReactNode;
// }

// /**
//  * Main layout wrapper for profile page
//  * Provides consistent padding and container constraints
//  */
// const ProfileLayout = ({ children }: ProfileLayoutProps) => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8 md:py-12">
//         <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileLayout;


import React from 'react';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout wrapper for profile page
 * Provides consistent container constraints with proper spacing for fixed navbar
 */
const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50"> {/* Added pt-16 for navbar space */}
      <div className="max-w-full bg-white shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;