import { Badge } from '@/components/ui/badge';

const PageBanner = ({ 
  title, 
  subtitle, 
  badge, 
  backgroundImage,
  className = '',
  size = 'medium' // small, medium, large
}) => {
  const sizeClasses = {
    small: 'py-8 sm:py-12',
    medium: 'py-12 sm:py-16', 
    large: 'py-16 sm:py-24'
  };

  return (
    <section className={`relative overflow-hidden border-b border-border ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      
      {backgroundImage && (
        <>
          <div className="absolute inset-0">
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/50" />
        </>
      )}

      <div className={`relative container mx-auto px-4 ${sizeClasses[size]}`}>
        <div className="text-center max-w-3xl mx-auto">
          {badge && (
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              {badge.icon && <badge.icon className="h-4 w-4 text-primary" />}
              <span className="text-sm font-medium text-primary">{badge.text}</span>
            </div>
          )}
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gradient-mystical mb-4 leading-tight">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageBanner;