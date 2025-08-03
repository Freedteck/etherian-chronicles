import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface ChapterData {
  title: string;
  content: string;
}

interface ChapterErrors {
  title?: string;
  content?: string;
}

interface ChapterCreatorProps {
  storyId: string;
  chapterNumber: number;
  onChapterCreated: () => void;
  onCancel: () => void;
}

const ChapterCreator = ({
  storyId,
  chapterNumber,
  onChapterCreated,
  onCancel,
}: ChapterCreatorProps) => {
  const [formData, setFormData] = useState<ChapterData>({
    title: "",
    content: "",
  });

  const [errors, setErrors] = useState<ChapterErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ChapterErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Chapter title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Chapter content is required";
    } else if (formData.content.length > 5000) {
      newErrors.content = "Content must be less than 5000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Simulate chapter creation
      toast(
        `Chapter ${chapterNumber}: "${formData.title}" has been added to the story.`
      );

      onChapterCreated();
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-display font-bold">
          Create Chapter {chapterNumber}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chapter Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Chapter Title *</Label>
          <Input
            id="title"
            placeholder="Enter chapter title..."
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            aria-describedby={errors.title ? "title-error" : undefined}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p id="title-error" className="text-sm text-destructive">
              {errors.title}
            </p>
          )}
        </div>

        {/* Chapter Content */}
        <div className="space-y-2">
          <Label htmlFor="content">
            Chapter Content * (max 5000 characters)
          </Label>
          <Textarea
            id="content"
            placeholder="Write your chapter content here..."
            rows={12}
            maxLength={5000}
            className="text-base leading-relaxed"
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            aria-describedby={`content-count ${
              errors.content ? "content-error" : ""
            }`.trim()}
            aria-invalid={!!errors.content}
          />
          <p id="content-count" className="text-sm text-muted-foreground">
            {formData.content.length}/5000 characters
          </p>
          {errors.content && (
            <p id="content-error" className="text-sm text-destructive">
              {errors.content}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="order-1 sm:order-2">
            <Plus className="h-4 w-4 mr-2" />
            Create Chapter
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChapterCreator;
