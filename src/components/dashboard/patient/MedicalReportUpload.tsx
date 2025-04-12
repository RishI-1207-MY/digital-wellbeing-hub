
import React from 'react';
import { FileUp } from 'lucide-react';
import ActionCard from './ActionCard';

const MedicalReportUploadCard: React.FC = () => {
  const goToReports = () => {
    const reportsTab = document.querySelector('[data-value="reports"]');
    if (reportsTab && reportsTab instanceof HTMLElement) {
      reportsTab.click();
    }
  };

  return (
    <ActionCard
      title="Upload Medical Reports"
      description="Share your medical reports securely with your healthcare provider"
      icon={FileUp}
      buttonText="Upload Reports"
      onClick={goToReports}
      className="bg-amber-50 border-amber-100"
      buttonVariant="default"
    />
  );
};

export default MedicalReportUploadCard;
