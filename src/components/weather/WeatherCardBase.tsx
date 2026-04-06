import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface WeatherCardBaseProps {
  title: string;
  icon?: LucideIcon | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element); // Allow custom SVGs too
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const WeatherCardBase: React.FC<WeatherCardBaseProps> = ({ title, icon: Icon, children, className, titleClassName, contentClassName }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 text-xl font-headline ${titleClassName}`}>
          {Icon && <Icon className="h-6 w-6 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  );
};

export default WeatherCardBase;
