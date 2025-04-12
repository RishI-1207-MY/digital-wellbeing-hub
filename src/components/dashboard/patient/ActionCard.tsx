
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onClick: () => void;
  className?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon: Icon,
  buttonText,
  onClick,
  className = '',
  buttonVariant = 'default'
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Icon className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full"
          variant={buttonVariant}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
