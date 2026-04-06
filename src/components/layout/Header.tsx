import { CloudSun } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-primary/10 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <CloudSun className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold text-primary">WeatherWise</h1>
          </Link>
          {/* Navigation items can be added here if needed */}
        </div>
      </div>
    </header>
  );
};

export default Header;
