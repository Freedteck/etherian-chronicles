import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import StoryDetailsStep from "./StoryDetailsStep";
import ChapterContentStep from "./ChapterContentStep";
import CollaboratorsStep from "./CollaboratorsStep";
import { uploadJsonToPinata } from "@/lib/pinata";
import { createStory } from "@/data/proposalData";
import { useActiveAccount } from "thirdweb/react";

interface Collaborator {
  id: string;
  address: string;
  email: string;
}

interface FormData {
  title: string;
  summary: string;
  coverImage: string;
  genres: string[];
  chapterTitle: string;
  firstChapter: string;
  votingOptions: string[];
  collaborators: Collaborator[];
}

interface FormErrors {
  title?: string;
  summary?: string;
  firstChapter?: string;
  chapterTitle?: string;
  coverImage?: string;
  genres?: string;
  votingOptions?: string;
  collaborators?: string;
}

const steps = [
  {
    id: 1,
    title: "Story Details",
    description: "Basic information about your story",
  },
  { id: 2, title: "First Chapter", description: "Write your opening chapter" },
  {
    id: 3,
    title: "Collaborators",
    description: "Add collaborators and finalize",
  },
];

const CreateStoryForm = () => {
  const account = useActiveAccount();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    summary: "",
    coverImage: "",
    genres: [],
    chapterTitle: "",
    firstChapter: "",
    votingOptions: [],
    collaborators: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingToastId, setLoadingToastId] = useState<string | null>(null);

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = "Story title is required";
      } else if (formData.title.length > 100) {
        newErrors.title = "Title must be less than 100 characters";
      }

      if (!formData.summary.trim()) {
        newErrors.summary = "Story summary is required";
      } else if (formData.summary.length > 500) {
        newErrors.summary = "Summary must be less than 500 characters";
      }

      if (formData.coverImage && !/^https?:\/\/.+/.test(formData.coverImage)) {
        newErrors.coverImage = "Please enter a valid URL";
      }

      if (formData.genres.length === 0) {
        newErrors.genres = "At least one genre is required";
      } else if (formData.genres.length > 5) {
        newErrors.genres = "Maximum 5 genres allowed";
      }
    }

    if (step === 2) {
      if (!formData.chapterTitle.trim()) {
        newErrors.chapterTitle = "Chapter title is required";
      } else if (formData.chapterTitle.length > 100) {
        newErrors.chapterTitle =
          "Chapter title must be less than 100 characters";
      }

      if (!formData.firstChapter.trim()) {
        newErrors.firstChapter = "First chapter content is required";
      } else if (formData.firstChapter.length > 5000) {
        newErrors.firstChapter = "Chapter must be less than 5000 characters";
      }

      if (
        formData.votingOptions.length > 0 &&
        formData.votingOptions.length < 2
      ) {
        newErrors.votingOptions =
          "If adding voting options, minimum 2 are required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    console.log("Submitting story with data:", formData);

    if (validateStep(currentStep)) {
      setIsSubmitting(true);

      const toastResult = toast({
        title: "Creating story...",
        description: "Your story is being created. Please wait.",
      });
      setLoadingToastId(toastResult.id);

      try {
        const firstChapter = {
          title: formData.chapterTitle,
          content: formData.firstChapter,
          votingOptions: formData.votingOptions,
          genres: formData.genres,
        };

        const firstChapterIpfsUrl = await uploadJsonToPinata(firstChapter);

        if (!firstChapterIpfsUrl) {
          if (loadingToastId) {
            toastResult.dismiss();
          }
          toast({
            variant: "destructive",
            title: "Error uploading first chapter",
            description: "Please try again later.",
          });
          return;
        }

        const storyData = {
          _title: formData.title,
          _summary: formData.summary,
          _ipfsHashImage: formData.coverImage,
          _ipfsHashChapter1Content: firstChapterIpfsUrl,
          _chapter1Choices: formData.votingOptions,
          _collaborators: formData.collaborators.map((c) => c.address),
        };

        const transactionHash = await createStory(storyData, account);

        if (loadingToastId) {
          toastResult.dismiss();
        }

        if (transactionHash) {
          toast({
            variant: "success",
            title: "Story created successfully",
            description: "Your story has been created.",
          });
          navigate("/stories");
        } else {
          toast({
            variant: "destructive",
            title: "Transaction failed",
            description: "Please try again later.",
          });
        }
      } catch (error) {
        if (loadingToastId) {
          toastResult.dismiss();
        }
        toast({
          variant: "destructive",
          title: "Error creating story",
          description: "Please try again later.",
        });
      } finally {
        setIsSubmitting(false);
        setLoadingToastId(null);
      }
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StoryDetailsStep
            data={formData}
            errors={errors}
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <ChapterContentStep
            data={formData}
            errors={errors}
            onUpdate={updateFormData}
          />
        );
      case 3:
        return (
          <CollaboratorsStep
            data={formData}
            errors={errors}
            onUpdate={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex flex-col items-center ${
                  index < steps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
                <div className="text-center">
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= step.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <div className="mb-8">{renderStep()}</div>

      {/* Navigation */}
      <Card className="p-6">
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={
              currentStep === 1 ? () => navigate("/stories") : handlePrev
            }
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? "Cancel" : "Previous"}
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="flex items-center">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-mystical flex items-center"
            >
              <Crown className="h-4 w-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Story"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CreateStoryForm;
