const Footer = () => {
  return (
    <footer className="mt-auto py-6 text-center text-muted-foreground text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} WeatherWise. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
