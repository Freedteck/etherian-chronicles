import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Crown, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const StorySlideshow = ({ stories }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!stories || stories.length === 0) return null;

  const currentStory = stories[currentSlide];

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentStory.coverImage}
          alt={currentStory.title}
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-16 sm:py-24">
        <div className="flex items-center justify-center">
          {/* Content - Centered */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Badge className="bg-primary/90 text-white">
                Featured Story
              </Badge>
              {currentStory.trending && (
                <Badge variant="secondary" className="bg-secondary/90">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-gradient-mystical mb-6 leading-tight">
              {currentStory.title}
            </h1>

            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center space-x-1">
                <Crown className="h-4 w-4" />
                <span>by {currentStory.creator.username}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{currentStory.votesTotal} votes</span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              {currentStory.summary}
            </p>

            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {currentStory.genre.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>

            <Link to={`/stories/${currentStory.id}`}>
              <Button size="lg" className="btn-mystical">
                Read Story
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="bg-background/50 backdrop-blur-sm border-border/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Dots */}
          <div className="flex space-x-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="bg-background/50 backdrop-blur-sm border-border/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StorySlideshow;