
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
    console.log('📅 Date selected:', newDate?.format(), 'formatted:', formattedDate);
    const syntheticEvent = {
      target: { value: formattedDate }
    } as React.ChangeEvent<HTMLInputElement>;
    console.log('🚀 Calling onChange with:', formattedDate);
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



// import React from 'react';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { TextField } from '@mui/material';
// import dayjs, { Dayjs } from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';

// // Enable custom parsing for dayjs
// dayjs.extend(customParseFormat);

// interface DateResponseProps {
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   disabled?: boolean;
//   placeholder?: string;
//   className?: string;
// }

// export function DateResponse({
//   value,
//   onChange,
//   disabled = false,
//   placeholder = 'Select your date of birth',
//   className = ''
// }: DateResponseProps) {
  
//   // Convert string value to dayjs object
//   // Handle both DD/MM/YYYY and YYYY-MM-DD formats for backwards compatibility
//   const dateValue = value ? (() => {
//     // Try DD/MM/YYYY format first
//     if (value.includes('/')) {
//       const parsed = dayjs(value, 'DD/MM/YYYY', true);
//       if (parsed.isValid()) return parsed;
//     }
//     // Fallback to YYYY-MM-DD format for existing data
//     if (value.includes('-')) {
//       const parsed = dayjs(value, 'YYYY-MM-DD', true);
//       if (parsed.isValid()) return parsed;
//     }
//     // Fallback to automatic parsing
//     return dayjs(value);
//   })() : null;
  
//   // Handle date change from MUI DatePicker
//   const handleDateChange = (newDate: Dayjs | null) => {
//     // Format date as DD/MM/YYYY instead of YYYY-MM-DD
//     const formattedDate = newDate ? newDate.format('DD/MM/YYYY') : '';
//     console.log('📅 Date selected:', newDate?.format(), 'formatted as DD/MM/YYYY:', formattedDate);
    
//     const syntheticEvent = {
//       target: { value: formattedDate }
//     } as React.ChangeEvent<HTMLInputElement>;
//     console.log('🚀 Calling onChange with DD/MM/YYYY format:', formattedDate);
//     onChange(syntheticEvent);
//   };

//   return (
//     <div className={`date-response ${className}`}>
//       <DatePicker
//         value={dateValue}
//         onChange={handleDateChange}
//         disabled={disabled}
//         maxDate={dayjs()} // Today as maximum date
//         openTo="year" // Opens with year picker first (perfect for birth dates)
//         views={['year', 'month', 'day']} // Allow year, month, day selection
//         enableAccessibleFieldDOMStructure={false}
//         format="DD/MM/YYYY" // Display format in the input field
//         slots={{
//           textField: TextField
//         }}
//         slotProps={{
//           textField: {
//             placeholder: placeholder,
//             fullWidth: true,
//             variant: 'outlined',
//             sx: {
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '8px',
//                 fontSize: '20px',
//                 fontFamily: 'Gilroy-Medium',
//                 '& fieldset': {
//                   borderColor: '#A1A1AA',
//                 },
//                 '&:hover fieldset': {
//                   borderColor: '#71717A',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#0EA5E9',
//                   borderWidth: '1px',
//                 },
//                 '& input': {
//                   padding: '12px',
//                   fontSize: '20px',
//                   fontFamily: 'Gilroy-Medium',
//                 }
//               }
//             }
//           }
//         }}
//       />
      
//       {/* Hidden input for form compatibility */}
//       <input
//         type="hidden"
//         value={value}
//         onChange={onChange}
//         disabled={disabled}
//       />
//     </div>
//   );
// }

// export default DateResponse;