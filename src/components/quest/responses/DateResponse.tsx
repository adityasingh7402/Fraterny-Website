// import React, { useState } from 'react';
// import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { format } from 'date-fns';

// interface DateResponseProps {
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   disabled?: boolean;
//   placeholder?: string;
//   className?: string;
// }

// // Calendar component for date selection
// function Calendar({ 
//   selected, 
//   onSelect, 
//   maxDate 
// }: { 
//   selected: Date | undefined; 
//   onSelect: (date: Date) => void; 
//   maxDate: Date;
// }) {
//   const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  
//   const today = new Date();
//   const currentYear = currentMonth.getFullYear();
//   const currentMonthIndex = currentMonth.getMonth();
  
//   // Get days in month
//   const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
//   const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
  
//   // Generate calendar days
//   const days = [];
  
//   // Empty cells for days before month starts
//   for (let i = 0; i < firstDayOfMonth; i++) {
//     days.push(null);
//   }
  
//   // Days of the month
//   for (let day = 1; day <= daysInMonth; day++) {
//     days.push(new Date(currentYear, currentMonthIndex, day));
//   }
  
//   const navigateMonth = (direction: 'prev' | 'next') => {
//     setCurrentMonth(prev => {
//       const newMonth = new Date(prev);
//       if (direction === 'prev') {
//         newMonth.setMonth(newMonth.getMonth() - 1);
//       } else {
//         newMonth.setMonth(newMonth.getMonth() + 1);
//       }
//       return newMonth;
//     });
//   };
  
//   const isDateDisabled = (date: Date) => {
//     return date > maxDate || date > today;
//   };
  
//   const isSelected = (date: Date) => {
//     return selected && 
//            date.getDate() === selected.getDate() && 
//            date.getMonth() === selected.getMonth() && 
//            date.getFullYear() === selected.getFullYear();
//   };
  
//   return (
//     <div className="p-3">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <button
//           onClick={() => navigateMonth('prev')}
//           className="p-1 hover:bg-gray-100 rounded-md transition-colors"
//         >
//           <ChevronLeft className="w-4 h-4" />
//         </button>
        
//         <div className="font-semibold">
//           {format(currentMonth, 'MMMM yyyy')}
//         </div>
        
//         <button
//           onClick={() => navigateMonth('next')}
//           className="p-1 hover:bg-gray-100 rounded-md transition-colors"
//           disabled={currentMonth >= today}
//         >
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       </div>
      
//       {/* Days of week */}
//       <div className="grid grid-cols-7 gap-1 mb-2">
//         {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
//           <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
//             {day}
//           </div>
//         ))}
//       </div>
      
//       {/* Calendar grid */}
//       <div className="grid grid-cols-7 gap-1">
//         {days.map((date, index) => (
//           <div key={index} className="aspect-square">
//             {date && (
//               <button
//                 onClick={() => !isDateDisabled(date) && onSelect(date)}
//                 disabled={isDateDisabled(date)}
//                 className={`
//                   w-full h-full text-sm rounded-md transition-all
//                   ${isSelected(date) 
//                     ? 'bg-terracotta text-white' 
//                     : isDateDisabled(date)
//                     ? 'text-gray-300 cursor-not-allowed'
//                     : 'hover:bg-gray-100 text-gray-900'
//                   }
//                 `}
//               >
//                 {date.getDate()}
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // Popover component
// function Popover({ 
//   children, 
//   content, 
//   open, 
//   onOpenChange 
// }: { 
//   children: React.ReactNode; 
//   content: React.ReactNode; 
//   open: boolean; 
//   onOpenChange: (open: boolean) => void; 
// }) {
//   return (
//     <div className="relative">
//       <div onClick={() => onOpenChange(!open)}>
//         {children}
//       </div>
      
//       <AnimatePresence>
//         {open && (
//           <>
//             {/* Backdrop */}
//             <div 
//               className="fixed inset-0 z-10" 
//               onClick={() => onOpenChange(false)}
//             />
            
//             {/* Popover content */}
//             <motion.div
//               initial={{ opacity: 0, y: -10, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -10, scale: 0.95 }}
//               transition={{ duration: 0.2, ease: "easeOut" }}
//               className="absolute top-full mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg"
//             >
//               {content}
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export function DateResponse({
//   value,
//   onChange,
//   disabled = false,
//   placeholder = 'Select your date of birth',
//   className = ''
// }: DateResponseProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(
//     value ? new Date(value) : undefined
//   );
  
//   const maxDate = new Date(); // Today's date as maximum
  
//   const handleDateSelect = (date: Date) => {
//     setSelectedDate(date);
//     // Convert to YYYY-MM-DD format for the input
//     const formattedDate = format(date, 'yyyy-MM-dd');
    
//     // Create a synthetic event to match the expected onChange signature
//     const syntheticEvent = {
//       target: { value: formattedDate }
//     } as React.ChangeEvent<HTMLInputElement>;
    
//     onChange(syntheticEvent);
//     setIsOpen(false);
//   };
  
//   return (
//     <div className={`date-response ${className}`}>
//       <Popover
//         open={isOpen}
//         onOpenChange={setIsOpen}
//         content={
//           <Calendar
//             selected={selectedDate}
//             onSelect={handleDateSelect}
//             maxDate={maxDate}
//           />
//         }
//       >
//         <motion.button
//           type="button"
//           disabled={disabled}
//           whileHover={{ scale: disabled ? 1 : 1.01 }}
//           whileTap={{ scale: disabled ? 1 : 0.99 }}
//           className={`
//             w-full p-3 border rounded-lg text-left font-normal transition-all
//             flex items-center justify-between
//             ${disabled 
//               ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400' 
//               : isOpen
//               ? 'border-gray-300 ring-1 ring-terracotta/20'
//               : 'border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:ring-1'
//             }
//             ${!selectedDate && !disabled ? 'text-gray-500' : 'text-gray-900'}
//           `}
//         >
//           <div className="flex items-center">
//             <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
//             {selectedDate ? (
//               <span className="text-gray-900">
//                 {format(selectedDate, 'PPP')}
//               </span>
//             ) : (
//               <span className="text-gray-500">
//                 {placeholder}
//               </span>
//             )}
//           </div>
//         </motion.button>
//       </Popover>
      
//       {/* Hidden input to maintain form compatibility */}
//       <input
//         type="date"
//         value={value}
//         onChange={onChange}
//         className="sr-only"
//         max={format(maxDate, 'yyyy-MM-dd')}
//         disabled={disabled}
//         required
//       />
//     </div>
//   );
// }


import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

interface DateResponseProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function DateResponse({
  value,
  onChange,
  disabled = false,
  placeholder = 'Select your date of birth',
  className = ''
}: DateResponseProps) {
  
  // Convert string value to dayjs object
  const dateValue = value ? dayjs(value) : null;
  
  // Handle date change from MUI DatePicker
  const handleDateChange = (newDate: Dayjs | null) => {
    // Create synthetic event to match expected onChange signature
    const formattedDate = newDate ? newDate.format('YYYY-MM-DD') : '';
    const syntheticEvent = {
      target: { value: formattedDate }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  return (
    <div className={`date-response ${className}`}>
      <DatePicker
        value={dateValue}
        onChange={handleDateChange}
        disabled={disabled}
        maxDate={dayjs()} // Today as maximum date
        openTo="day" // Opens with year picker first (perfect for birth dates)
        views={['year', 'month', 'day']} // Allow year, month, day selection
        enableAccessibleFieldDOMStructure={false}
        slots={{
          textField: TextField
        }}
        slotProps={{
          textField: {
            placeholder: placeholder,
            fullWidth: true,
            variant: 'outlined',
            sx: {
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontSize: '20px',
                fontFamily: 'Gilroy-Medium',
                '& fieldset': {
                  borderColor: '#A1A1AA',
                },
                '&:hover fieldset': {
                  borderColor: '#71717A',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0EA5E9',
                  borderWidth: '1px',
                },
                '& input': {
                  padding: '12px',
                  fontSize: '20px',
                  fontFamily: 'Gilroy-Medium',
                }
              }
            }
          }
        }}
      />
      {/* <DatePicker
        label="Controlled picker"
      /> */}
      
      {/* Hidden input for form compatibility */}
      <input
        type="hidden"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

export default DateResponse;