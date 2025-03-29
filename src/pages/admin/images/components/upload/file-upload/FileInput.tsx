
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FileInputProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFileSelected?: boolean;
}

const FileInput = ({ onFileChange, isFileSelected }: FileInputProps) => {
  return (
    <div className="relative">
      <FormLabel className="block mb-1 font-medium">Image</FormLabel>
      <Input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className={`cursor-pointer ${isFileSelected ? 'border-navy' : ''}`}
      />
    </div>
  );
};

export default FileInput;
