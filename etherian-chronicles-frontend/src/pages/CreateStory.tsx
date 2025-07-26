import { Crown } from 'lucide-react';
import Header from '@/components/Layout/Header';
import PageBanner from '@/components/Layout/PageBanner';
import CreateStoryForm from '@/components/Story/CreateStoryForm';

const CreateStory = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PageBanner
        title="Create Your Story"
        subtitle="Bring your epic tale to life and let the community shape its destiny"
        badge={{ icon: Crown, text: "Story Creation" }}
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570"
        size="medium"
      />

      <main className="container mx-auto px-4 py-8" id="main-content">
        <CreateStoryForm />
      </main>
    </div>
  );
};

export default CreateStory;