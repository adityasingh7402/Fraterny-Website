
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { NameFields } from './components/NameFields';
import { EmailField } from './components/EmailField';
import { PhoneField } from './components/PhoneField';
import { PasswordField } from './components/PasswordField';
import { useRegisterForm } from './hooks/useRegisterForm';
import { RegisterFormValues } from './schemas/registerSchema';

interface RegisterFormProps {
  onRegistrationSuccess: (email: string, needsEmailVerification: boolean, error?: boolean) => void;
}

export const RegisterForm = ({ onRegistrationSuccess }: RegisterFormProps) => {
  const {
    form,
    isLoading,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    onSubmit,
  } = useRegisterForm({ onRegistrationSuccess });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <NameFields form={form} />
        <EmailField form={form} />
        <PhoneField form={form} />
        <PasswordField 
          form={form}
          showPassword={showPassword}
          toggleVisibility={togglePasswordVisibility}
          fieldName="password"
          label="Password"
          placeholder="Password"
        />
        <PasswordField 
          form={form}
          showPassword={showConfirmPassword}
          toggleVisibility={toggleConfirmPasswordVisibility}
          fieldName="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm password"
        />
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-terracotta hover:bg-terracotta/90"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
};
