/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { X, BookOpen, Plus, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card } from "../ui/card";

interface ChapterData {
  title: string;
  content: string;
  votingOptions: string[];
  isLastChapter?: boolean;
  votingQuestion?: string;
}

interface ChapterErrors {
  title?: string;
  content?: string;
  votingOptions?: string;
}

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyTitle: string;
  chapterNumber: number;
  onChapterAdded: (data: any) => void;
}

const AddChapterModal = ({
  isOpen,
  onClose,
  storyTitle,
  chapterNumber,
  onChapterAdded,
}: AddChapterModalProps) => {
  const { toast } = useToast();
  const [newOption, setNewOption] = useState("");

  const [formData, setFormData] = useState<ChapterData>({
    title: "",
    content: "",
    votingOptions: [],
    isLastChapter: false,
    votingQuestion: "",
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

    if (
      formData.votingOptions.length > 0 &&
      formData.votingOptions.length < 2
    ) {
      newErrors.votingOptions =
        "If adding voting options, minimum 2 are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Form Validation failed",
        description: "Fill out all required part of the form",
      });
      return;
    }
    const toastResult = toast({
      title: "Adding Chapter",
      description: "Chapter is being added. Please wait...",
    });

    try {
      await onChapterAdded(formData);
      toast({
        variant: "success",
        title: "Chapter added successfully",
        description: "New Chapter added successfully.",
      });

      // Reset form
      setFormData({ title: "", content: "", votingOptions: [] });
      setNewOption("");
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Adding Chapter failed",
        description: `Error adding chapter, please try again`,
      });
    }
  };

  const addVotingOption = () => {
    if (newOption.trim() && formData.votingOptions.length < 6) {
      setFormData((prev) => ({
        ...prev,
        votingOptions: [...prev.votingOptions, newOption.trim()],
      }));
      setNewOption("");
    }
  };

  const removeVotingOption = (voteOption: string) => {
    setFormData((prev) => ({
      ...prev,
      votingOptions: prev.votingOptions.filter(
        (option) => option !== voteOption
      ),
    }));
  };

  const updateVotingOption = (text: string) => {
    setFormData((prev) => ({
      ...prev,
      votingOptions: prev.votingOptions.map((option) =>
        option === text ? text : option
      ),
    }));
  };

  const addVotingQuestion = (question: string) => {
    setFormData((prev) => ({
      ...prev,
      votingQuestion: question,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>
              Add Chapter {chapterNumber} to "{storyTitle}"
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Chapter Title */}
          <div className="space-y-2">
            <Label htmlFor="chapterTitle">Chapter Title *</Label>
            <Input
              id="chapterTitle"
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
            <Label htmlFor="chapterContent">
              Chapter Content * (max 5000 characters)
            </Label>
            <Textarea
              id="chapterContent"
              placeholder="Write your chapter content here..."
              rows={10}
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

          <Card className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Vote className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-xl font-display font-bold">
                Chapter Settings
              </h2>
            </div>

            <div className="space-y-6">
              <div className=" flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isLastChapter"
                  checked={formData.isLastChapter || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isLastChapter: e.target.checked,
                    }))
                  }
                />
                <Label htmlFor="isLastChapter">This is the last chapter</Label>
              </div>
            </div>
          </Card>

          {/* Voting Options */}
          {!formData.isLastChapter && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Vote className="h-4 w-4 text-accent" />
                <Label>Voting Options (Optional)</Label>
              </div>

              <p className="text-sm text-muted-foreground">
                Add options for readers to vote on what happens next. If you add
                options, you need at least 2.
              </p>

              <div className="space-y-2">
                <label htmlFor="VotingQuestion">
                  Ask your readers a question
                </label>
                <Input
                  type="text"
                  id="VotingQuestion"
                  placeholder="What should happen next?"
                  value={formData.votingQuestion || ""}
                  onChange={(e) => addVotingQuestion(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Current Options */}
              {formData.votingOptions.length > 0 && (
                <div className="space-y-3">
                  {formData.votingOptions.map((option, index) => (
                    <div
                      key={option}
                      className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"
                    >
                      <Badge variant="outline" className="text-xs">
                        Option {String.fromCharCode(65 + index)}
                      </Badge>
                      <Input
                        value={option}
                        onChange={(e) => updateVotingOption(e.target.value)}
                        placeholder="Enter voting option..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVotingOption(option)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Option */}
              {formData.votingOptions.length < 6 && (
                <div className="flex space-x-3">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Enter a path readers can choose..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && addVotingOption()}
                  />
                  <Button
                    type="button"
                    onClick={addVotingOption}
                    disabled={!newOption.trim()}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              )}

              {errors.votingOptions && (
                <p className="text-sm text-destructive">
                  {errors.votingOptions}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-mystical order-1 sm:order-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Chapter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChapterModal;
