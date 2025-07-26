<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d82711f (Update contract call)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import StoryDetailsStep from "./StoryDetailsStep";
import ChapterContentStep from "./ChapterContentStep";
import CollaboratorsStep from "./CollaboratorsStep";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import StoryDetailsStep from './StoryDetailsStep';
import ChapterContentStep from './ChapterContentStep';
import CollaboratorsStep from './CollaboratorsStep';
>>>>>>> e9eef45 (Implement story creation enhancements)
=======
>>>>>>> d82711f (Update contract call)
=======
import { uploadJsonToPinata } from "@/lib/pinata";
import { createStory } from "@/data/proposalData";
import { useActiveAccount } from "thirdweb/react";
>>>>>>> 9508366 (Update contract calls)

interface VotingOption {
  id: string;
  text: string;
}

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
  votingOptions: VotingOption[];
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d82711f (Update contract call)
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
<<<<<<< HEAD
=======
  { id: 1, title: 'Story Details', description: 'Basic information about your story' },
  { id: 2, title: 'First Chapter', description: 'Write your opening chapter' },
  { id: 3, title: 'Collaborators', description: 'Add collaborators and finalize' }
>>>>>>> e9eef45 (Implement story creation enhancements)
=======
>>>>>>> d82711f (Update contract call)
];

const CreateStoryForm = () => {
  const account = useActiveAccount();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
<<<<<<< HEAD
<<<<<<< HEAD

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

=======
  
=======

>>>>>>> d82711f (Update contract call)
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
<<<<<<< HEAD
  
>>>>>>> e9eef45 (Implement story creation enhancements)
=======

>>>>>>> d82711f (Update contract call)
  const [errors, setErrors] = useState<FormErrors>({});

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
<<<<<<< HEAD
<<<<<<< HEAD

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

=======
    
=======

>>>>>>> d82711f (Update contract call)
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
<<<<<<< HEAD
    
>>>>>>> e9eef45 (Implement story creation enhancements)
=======

>>>>>>> d82711f (Update contract call)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
<<<<<<< HEAD
<<<<<<< HEAD
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
=======
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
>>>>>>> e9eef45 (Implement story creation enhancements)
=======
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
>>>>>>> d82711f (Update contract call)
    }
  };

  const handlePrev = () => {
<<<<<<< HEAD
<<<<<<< HEAD
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    console.log("Submitting story with data:", formData);

    if (validateStep(currentStep)) {
      toast({
        title: "Creating story...",
        description: "Your story is being created. Please wait.",
      });

<<<<<<< HEAD
      navigate("/stories");
=======
    setCurrentStep(prev => Math.max(prev - 1, 1));
=======
    setCurrentStep((prev) => Math.max(prev - 1, 1));
>>>>>>> d82711f (Update contract call)
  };

  const handleSubmit = () => {
    console.log("Submitting story with data:", formData);

    if (validateStep(currentStep)) {
      toast({
        title: "Story Created!",
        description:
          "Your story has been submitted and is now live for community interaction.",
      });
<<<<<<< HEAD
      
      navigate('/stories');
>>>>>>> e9eef45 (Implement story creation enhancements)
=======

      navigate("/stories");
>>>>>>> d82711f (Update contract call)
=======
      const firstChapter = {
        title: formData.chapterTitle,
        content: formData.firstChapter,
        votingOptions: formData.votingOptions,
        genres: formData.genres,
      };

      const firstChapterIpfsUrl = await uploadJsonToPinata(firstChapter);
      const storyData = {
        _title: formData.title,
        _summary: formData.summary,
        _ipfsHashImage: formData.coverImage,
        _ipfsHashChapter1Content: firstChapterIpfsUrl,
        _chapter1Choices: formData.votingOptions,
        _collaborators: formData.collaborators.map((c) => c.address),
      };
      if (!firstChapterIpfsUrl) {
        toast({
          variant: "destructive",
          title: "Error uploading first chapter",
          description: "Please try again later.",
        });
        return;
      } else {
        const transactionHash = await createStory(storyData, account);
        if (transactionHash) {
          toast({
            title: "Story created successfully",
            description: "Your story has been created.",
          });
          navigate("/stories");
        }
      }
>>>>>>> 9508366 (Update contract calls)
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
<<<<<<< HEAD
<<<<<<< HEAD
    setFormData((prev) => ({ ...prev, ...updates }));
=======
    setFormData(prev => ({ ...prev, ...updates }));
>>>>>>> e9eef45 (Implement story creation enhancements)
=======
    setFormData((prev) => ({ ...prev, ...updates }));
>>>>>>> d82711f (Update contract call)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d82711f (Update contract call)
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
<<<<<<< HEAD
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
=======
              <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.id}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
>>>>>>> e9eef45 (Implement story creation enhancements)
=======
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
>>>>>>> d82711f (Update contract call)
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
<<<<<<< HEAD
<<<<<<< HEAD

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
=======
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`} />
>>>>>>> e9eef45 (Implement story creation enhancements)
=======

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
>>>>>>> d82711f (Update contract call)
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
<<<<<<< HEAD
<<<<<<< HEAD
      <div className="mb-8">{renderStep()}</div>
=======
      <div className="mb-8">
        {renderStep()}
      </div>
>>>>>>> e9eef45 (Implement story creation enhancements)
=======
      <div className="mb-8">{renderStep()}</div>
>>>>>>> d82711f (Update contract call)

      {/* Navigation */}
      <Card className="p-6">
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
<<<<<<< HEAD
<<<<<<< HEAD
            onClick={
              currentStep === 1 ? () => navigate("/stories") : handlePrev
            }
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? "Cancel" : "Previous"}
          </Button>

=======
            onClick={currentStep === 1 ? () => navigate('/stories') : handlePrev}
=======
            onClick={
              currentStep === 1 ? () => navigate("/stories") : handlePrev
            }
>>>>>>> d82711f (Update contract call)
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? "Cancel" : "Previous"}
          </Button>
<<<<<<< HEAD
          
>>>>>>> e9eef45 (Implement story creation enhancements)
=======

>>>>>>> d82711f (Update contract call)
          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="flex items-center">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d82711f (Update contract call)
            <Button
              onClick={handleSubmit}
              className="btn-mystical flex items-center"
            >
<<<<<<< HEAD
=======
            <Button onClick={handleSubmit} className="btn-mystical flex items-center">
>>>>>>> e9eef45 (Implement story creation enhancements)
=======
>>>>>>> d82711f (Update contract call)
              <Crown className="h-4 w-4 mr-2" />
              Create Story
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

<<<<<<< HEAD
<<<<<<< HEAD
export default CreateStoryForm;
=======
export default CreateStoryForm;
>>>>>>> e9eef45 (Implement story creation enhancements)
=======
export default CreateStoryForm;
>>>>>>> d82711f (Update contract call)
