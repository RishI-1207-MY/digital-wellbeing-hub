
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'emergency':
      return <Badge className="bg-red-500">Emergency</Badge>;
    case 'critical':
      return <Badge className="bg-orange-500">Critical</Badge>;
    case 'follow-up':
      return <Badge variant="outline" className="text-blue-500 border-blue-200">Follow-up</Badge>;
    default:
      return <Badge variant="outline" className="text-green-500 border-green-200">Stable</Badge>;
  }
};

export default StatusBadge;
