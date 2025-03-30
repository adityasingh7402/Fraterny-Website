
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from '../schemas/registerSchema';
import { sanitizePhoneInput } from '../utils/phoneUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';
import { COUNTRY_CODES } from '../utils/countryCodes';

interface PhoneFieldProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const PhoneField = ({ form }: PhoneFieldProps) => {
  const [countryCode, setCountryCode] = useState('+91'); // Default to India

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    
    // Update the mobile number in the form with the new country code
    const currentNumber = form.getValues('mobileNumber');
    const numberWithoutCode = currentNumber.replace(/^\+\d+/, '');
    form.setValue('mobileNumber', value + numberWithoutCode);
  };

  return (
    <FormField
      control={form.control}
      name="mobileNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mobile Number</FormLabel>
          <FormControl>
            <div className="flex gap-2">
              <Select 
                value={countryCode} 
                onValueChange={handleCountryCodeChange}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                className="flex-1"
                placeholder="Mobile number without country code" 
                {...field}
                onChange={(e) => {
                  // Remove any existing country code from input
                  let value = sanitizePhoneInput(e.target.value);
                  if (value.startsWith('+')) {
                    value = value.replace(/^\+\d+/, '');
                  }
                  
                  // Always prepend the selected country code
                  field.onChange(countryCode + value);
                }} 
              />
            </div>
          </FormControl>
          <FormMessage />
          <p className="text-xs text-gray-500 mt-1">
            Format: {countryCode} followed by your number without spaces or special characters
          </p>
        </FormItem>
      )}
    />
  );
};
