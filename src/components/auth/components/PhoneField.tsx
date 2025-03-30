
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from '../schemas/registerSchema';
import { sanitizePhoneInput } from '../utils/phoneUtils';

interface PhoneFieldProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const PhoneField = ({ form }: PhoneFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="mobileNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mobile Number</FormLabel>
          <FormControl>
            <Input 
              placeholder="Mobile number (e.g. 919876543210)" 
              {...field}
              onChange={(e) => {
                // Sanitize input to only allow valid characters
                const value = sanitizePhoneInput(e.target.value);
                field.onChange(value);
              }} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
