
import React from 'react';
import { 
  Activity, 
  VideoIcon, 
  MessageCircle, 
  Bell, 
  ClipboardList, 
  HeartPulse
} from 'lucide-react';

const features = [
  {
    name: 'Real-time Health Monitoring',
    description: 'Track your vitals in real-time with wearable device integration, ensuring continuous health oversight.',
    icon: Activity
  },
  {
    name: 'Video Consultations',
    description: 'Connect with healthcare professionals through secure, high-quality video consultations from anywhere.',
    icon: VideoIcon
  },
  {
    name: 'Mental Health Support',
    description: 'Access confidential mental health support through our secure chat platform, with optional anonymity.',
    icon: MessageCircle
  },
  {
    name: 'Emergency Alerts',
    description: 'Trigger instant emergency alerts that notify your healthcare provider and emergency contacts.',
    icon: Bell
  },
  {
    name: 'Electronic Health Records',
    description: 'Access your complete medical history securely stored with blockchain technology for data integrity.',
    icon: ClipboardList
  },
  {
    name: 'Symptom Checker',
    description: 'Use our AI-powered symptom checker to get preliminary insights about your health concerns.',
    icon: HeartPulse
  }
];

const Features = () => {
  return (
    <div className="py-24 bg-lifesage-light" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-lifesage-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to receive healthcare
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform bridges the gap between patients and healthcare providers, making quality care accessible to everyone.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-lifesage-primary rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
