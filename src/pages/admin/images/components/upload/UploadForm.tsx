
import { IMAGE_CATEGORIES } from './constants';
import { UploadFormState } from './useUploadForm';

interface UploadFormProps {
  uploadForm: UploadFormState;
  setUploadForm: (state: React.SetStateAction<UploadFormState>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadForm = ({
  uploadForm,
  setUploadForm,
  fileInputRef,
  handleFileChange
}: UploadFormProps) => {
  return (
    <>
      <div>
        <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
          Image Key <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="key"
          value={uploadForm.key}
          onChange={(e) => setUploadForm(prev => ({ ...prev, key: e.target.value }))}
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
          placeholder="e.g., hero-background, team-photo-1"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          A unique identifier used to fetch this image later
        </p>
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={uploadForm.category}
          onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
        >
          <option value="">Select a category</option>
          {IMAGE_CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="description"
          value={uploadForm.description}
          onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
          placeholder="e.g., Main hero background image"
          required
        />
      </div>
      
      <div>
        <label htmlFor="alt_text" className="block text-sm font-medium text-gray-700 mb-1">
          Alt Text <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="alt_text"
          value={uploadForm.alt_text}
          onChange={(e) => setUploadForm(prev => ({ ...prev, alt_text: e.target.value }))}
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
          placeholder="e.g., Luxury villa with ocean view"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Text description for accessibility
        </p>
      </div>
      
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
          Image File <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
          accept="image/*"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Upload file (PNG, JPG, WEBP or SVG format, max 50MB)
        </p>
      </div>
    </>
  );
};

export default UploadForm;
