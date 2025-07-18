import { useEffect, useState } from 'react';
import { getCurrentUserId } from '../utils/userUtils';

/**
 * Custom hook to automatically populate applicant ID in forms
 * @param {Record<string, any>} initialData - Initial form data
 * @param {string} fieldName - The field name to populate (default: 'applicant_id')
 * @returns {[Record<string, any>, Function]} - [formData, setFormData]
 */
export const useAutoPopulateApplicantId = (
  initialData: Record<string, any> = {},
  fieldName: string = 'applicant_id'
): [Record<string, any>, React.Dispatch<React.SetStateAction<Record<string, any>>>] => {
  const [dataToSave, setDataToSave] = useState<Record<string, any>>(initialData);

  useEffect(() => {
    const applicantId = getCurrentUserId();
    
    if (applicantId) {
      setDataToSave((prev) => ({
        ...prev,
        [fieldName]: applicantId,
      }));
      console.log(`Auto-populated ${fieldName}:`, applicantId);
    } else {
      setDataToSave((prev) => ({
        ...prev,
        [fieldName]: "nil",
      }));
      console.warn(`No user ID found in session storage for ${fieldName}`);
    }
  }, [fieldName]);

  return [dataToSave, setDataToSave];
};
