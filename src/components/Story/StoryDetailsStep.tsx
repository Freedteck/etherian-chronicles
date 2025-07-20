import { FileText, Upload, Tag, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface StoryDetailsStepProps {
  data: {
    title: string;
    summary: string;
    coverImage: string;
    genres: string[];
  };
  errors: {
    title?: string;
    summary?: string;
    coverImage?: string;
    genres?: string;
  };
  onUpdate: (updates: any) => void;
}

const availableGenres = [
  'Fantasy', 'Adventure', 'Steampunk', 'Political', 'Revolution', 
  'Technology', 'Romance', 'Mystery', 'Sci-Fi', 'Horror', 'Comedy'
];

const StoryDetailsStep = ({ data, errors, onUpdate }: StoryDetailsStepProps) => {
  const { toast } = useToast();

  const handleGenreAdd = (genre: string) => {
    if (genre && !data.genres.includes(genre) && data.genres.length < 5) {
      onUpdate({
        genres: [...data.genres, genre]
      });
    }
  };

  const handleGenreRemove = (genre: string) => {
    onUpdate({
      genres: data.genres.filter(g => g !== genre)
    });
  };

  return (
    <Card className="p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-display font-bold">Story Details</h2>
      </div>
      
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Story Title *</Label>
          <Input
            id="title"
            placeholder="Enter your story's title..."
            className="text-lg"
            value={data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            aria-describedby={errors.title ? "title-error" : undefined}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p id="title-error" className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <Label htmlFor="summary">Story Summary * (max 500 characters)</Label>
          <Textarea
            id="summary"
            placeholder="Describe your story's premise, setting, and main conflict..."
            rows={4}
            maxLength={500}
            value={data.summary}
            onChange={(e) => onUpdate({ summary: e.target.value })}
            aria-describedby={`summary-count ${errors.summary ? "summary-error" : ""}`.trim()}
            aria-invalid={!!errors.summary}
          />
          <p id="summary-count" className="text-sm text-muted-foreground">
            {data.summary.length}/500 characters
          </p>
          {errors.summary && (
            <p id="summary-error" className="text-sm text-destructive">{errors.summary}</p>
          )}
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <div className="flex gap-3">
            <Input
              id="coverImage"
              placeholder="https://..."
              value={data.coverImage}
              onChange={(e) => onUpdate({ coverImage: e.target.value })}
              aria-describedby={errors.coverImage ? "coverImage-error" : undefined}
              aria-invalid={!!errors.coverImage}
            />
            <Button type="button" variant="outline" onClick={() => toast({ title: "Upload functionality coming soon!" })}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          {data.coverImage && (
            <div className="mt-3">
              <img 
                src={data.coverImage} 
                alt="Cover preview"
                className="w-32 h-48 object-cover rounded-lg border border-border"
              />
            </div>
          )}
          {errors.coverImage && (
            <p id="coverImage-error" className="text-sm text-destructive">{errors.coverImage}</p>
          )}
        </div>

        {/* Genres */}
        <div className="space-y-2">
          <Label>Genres * (1-5 genres)</Label>
          
          {/* Available Genres */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-sm text-muted-foreground w-full mb-2">Click to add genres:</span>
            {availableGenres.filter(g => !data.genres.includes(g)).map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreAdd(genre)}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                disabled={data.genres.length >= 5}
              >
                <Tag className="h-3 w-3 mr-1" />
                {genre}
              </button>
            ))}
          </div>
          
          {/* Selected Genres */}
          <div className="flex flex-wrap gap-2">
            {data.genres.map((genre) => (
              <Badge key={genre} className="bg-primary text-primary-foreground">
                {genre}
                <button
                  type="button"
                  className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                  onClick={() => handleGenreRemove(genre)}
                  aria-label={`Remove ${genre} genre`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          {errors.genres && (
            <p className="text-sm text-destructive">{errors.genres}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StoryDetailsStep;