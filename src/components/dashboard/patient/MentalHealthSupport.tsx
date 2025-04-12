
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ActionCard from './ActionCard';

const MentalHealthSupport: React.FC = () => {
  const { toast } = useToast();

  const startMentalHealthChat = () => {
    toast({
      title: "Mental Health Support",
      description: "This feature is coming soon. You'll be able to chat anonymously with mental health professionals.",
    });
  };

  return (
    <ActionCard
      title="Mental Health Support"
      description="Connect with mental health professionals through secure chat"
      icon={MessageCircle}
      buttonText="Start Anonymous Chat"
      onClick={startMentalHealthChat}
      className="bg-purple-50 border-purple-100"
      buttonVariant="default"
    />
  );
};

export default MentalHealthSupport;
