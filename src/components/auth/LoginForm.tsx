import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { EmailFieldLogin } from './components/EmailFieldLogin';
import { PasswordFieldLogin } from './components/PasswordFieldLogin';
import { useLoginForm } from './hooks/useLoginForm';

export const LoginForm = () => {
  const {
    form,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    onSubmit,
  } = useLoginForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <EmailFieldLogin form={form} />
        <PasswordFieldLogin 
          form={form}
          showPassword={showPassword}
          toggleVisibility={togglePasswordVisibility}
        />
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-terracotta hover:bg-terracotta/90"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
};