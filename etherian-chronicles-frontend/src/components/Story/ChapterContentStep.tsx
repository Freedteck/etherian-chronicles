/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { BookOpen, Plus, X, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ChapterContentStepProps {
  data: {
    chapterTitle: string;
    firstChapter: string;
    votingOptions: string[];
    isLastChapter?: boolean;
    votingQuestion?: string;
  };
  errors: {
    chapterTitle?: string;
    firstChapter?: string;
    votingOptions?: string;
  };
  onUpdate: (updates: any) => void;
}

const ChapterContentStep = ({
  data,
  errors,
  onUpdate,
}: ChapterContentStepProps) => {
  const [newOption, setNewOption] = useState("");

  const addVotingOption = () => {
    if (newOption.trim() && data.votingOptions.length < 6) {
      onUpdate({
        votingOptions: [...data.votingOptions, newOption.trim()],
      });
      setNewOption("");
    }
  };

  const removeVotingOption = (voteOption: string) => {
    onUpdate({
      votingOptions: data.votingOptions.filter(
        (option) => option !== voteOption
      ),
    });
  };

  const updateVotingOption = (text: string) => {
    onUpdate({
      votingOptions: data.votingOptions.map((option) =>
        option === text ? text : option
      ),
    });
  };

  return (
    <div className="space-y-8">
      {/* Chapter Content */}
      <Card className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="text-xl font-display font-bold">Chapter 1: Opening</h2>
        </div>

        <div className="space-y-6">
          {/* Chapter Title */}
          <div className="space-y-2">
            <Label htmlFor="chapterTitle">Chapter Title *</Label>
            <Input
              id="chapterTitle"
              placeholder="Enter chapter title (e.g., 'The Journey Begins')"
              value={data.chapterTitle}
              onChange={(e) => onUpdate({ chapterTitle: e.target.value })}
              aria-describedby={
                errors.chapterTitle ? "chapterTitle-error" : undefined
              }
              aria-invalid={!!errors.chapterTitle}
            />
            {errors.chapterTitle && (
              <p id="chapterTitle-error" className="text-sm text-destructive">
                {errors.chapterTitle}
              </p>
            )}
          </div>

          {/* Chapter Content */}
          <div className="space-y-2">
            <Label htmlFor="firstChapter">
              Chapter Content * (max 5000 characters)
            </Label>
            <Textarea
              id="firstChapter"
              placeholder="Begin your story here... Set the scene, introduce your characters, and hook your readers..."
              rows={12}
              maxLength={5000}
              className="text-base leading-relaxed"
              value={data.firstChapter}
              onChange={(e) => onUpdate({ firstChapter: e.target.value })}
              aria-describedby={`firstChapter-count ${
                errors.firstChapter ? "firstChapter-error" : ""
              }`.trim()}
              aria-invalid={!!errors.firstChapter}
            />
            <p
              id="firstChapter-count"
              className="text-sm text-muted-foreground"
            >
              {data.firstChapter.length}/5000 characters
            </p>
            {errors.firstChapter && (
              <p id="firstChapter-error" className="text-sm text-destructive">
                {errors.firstChapter}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Vote className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="text-xl font-display font-bold">Chapter Settings</h2>

        </div>

        <div className="space-y-6">
          <div className=" flex items-center space-x-3">
            <input type="checkbox" id="isLastChapter" checked={data.isLastChapter || false} 
            onChange={(e)=> onUpdate({isLastChapter: e.target.checked})} />
             <Label htmlFor="isLastChapter">This is the last chapter</Label>

          </div>

        </div>
      </Card>

      {/* Voting Options */}
      {!data.isLastChapter &&(

      <Card className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Vote className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-xl font-display font-bold">Voting Options</h2>
        </div>

        <div className="space-y-6 ">
          <p  >
            Add voting options to let readers choose the story's direction. This
            is optional, but if you add options, you need at least 2.
          </p>

          <div className="space-y-2" >
            <label htmlFor="VotingQuestion" >Ask your readers a question</label>
            <Input type="text" id="VotingQuestion" placeholder="What should happen next?" value={data.votingQuestion || ""} onChange={(e)=> onUpdate({votingQuestion: e.target.value})}   required/>

          </div>

          {/* Current Options */}
          {data.votingOptions.length > 0 && (
            <div className="space-y-3">
              <Label>Current Options:</Label>
              {data.votingOptions.map((option, index) => (
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
          {data.votingOptions.length < 6 && (
            <div className="space-y-3">
              <Label htmlFor="newOption">Add Voting Option:</Label>
              <div className="flex space-x-3">
                <Input
                  id="newOption"
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
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          )}

          {data.votingOptions.length >= 6 && (
            <p className="text-sm text-muted-foreground">
              Maximum of 6 voting options allowed.
            </p>
          )}

          {errors.votingOptions && (
            <p className="text-sm text-destructive">{errors.votingOptions}</p>
          )}
        </div>
      </Card>
      )}
    </div>
  );
};

export default ChapterContentStep;
