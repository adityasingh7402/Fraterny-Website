
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FileInputProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput = ({ onFileChange }: FileInputProps) => {
  return (
    <div className="relative">
      <FormLabel className="block mb-1 font-medium">Image</FormLabel>
      <Input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="cursor-pointer"
      />
    </div>
  );
};

export default FileInput;
