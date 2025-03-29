
import { useFormState, UploadFormState } from './useFormState';
import { useCropState } from './useCropState';
import { useUploadImageMutation } from './useUploadMutation';

export { UploadFormState };
export { useUploadImageMutation };

export const useUploadForm = () => {
  const formState = useFormState();
  const cropState = useCropState();
  
  const resetAll = () => {
    formState.resetUploadForm();
    cropState.resetCropState();
  };
  
  return {
    ...formState,
    ...cropState,
    resetUploadForm: resetAll
  };
};
