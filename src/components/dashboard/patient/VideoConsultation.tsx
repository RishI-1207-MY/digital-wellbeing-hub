
import React from 'react';
import { Video } from 'lucide-react';
import ActionCard from './ActionCard';

const VideoConsultationCard: React.FC = () => {
  const startVideoConsultation = () => {
    const consultationTab = document.querySelector('[data-value="consultation"]');
    if (consultationTab && consultationTab instanceof HTMLElement) {
      consultationTab.click();
    }
  };

  return (
    <ActionCard
      title="Video Consultation"
      description="Schedule or start a video call with your healthcare provider"
      icon={Video}
      buttonText="Start Consultation"
      onClick={startVideoConsultation}
      className="bg-blue-50 border-blue-100"
      buttonVariant="default"
    />
  );
};

export default VideoConsultationCard;
