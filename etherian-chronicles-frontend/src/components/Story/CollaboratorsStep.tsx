/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Users, Plus, X, Wand2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Collaborator {
  id: string;
  address: string;
  email: string;
}

interface CollaboratorsStepProps {
  data: {
    collaborators: Collaborator[];
  };
  errors: {
    collaborators?: string;
  };
  onUpdate: (updates: any) => void;
}

const CollaboratorsStep = ({
  data,
  errors,
  onUpdate,
}: CollaboratorsStepProps) => {
  const [newCollaborator, setNewCollaborator] = useState({
    address: "",
    email: "",
  });

  const addCollaborator = () => {
    if (newCollaborator.address.trim() && newCollaborator.email.trim()) {
      const collaborator = {
        id: Date.now().toString(),
        address: newCollaborator.address.trim(),
        email: newCollaborator.email.trim(),
      };
      onUpdate({
        collaborators: [...data.collaborators, collaborator],
      });
      setNewCollaborator({ address: "", email: "" });
    }
  };

  const removeCollaborator = (id: string) => {
    onUpdate({
      collaborators: data.collaborators.filter((collab) => collab.id !== id),
    });
  };

  return (
    <div className="space-y-8">
      {/* Collaborators */}
      <Card className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-display font-bold">Collaborators</h2>
        </div>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Invite other writers to collaborate on your story. Collaborators can
            add new chapters and help shape the narrative.
          </p>

          {/* Current Collaborators */}
          {data.collaborators.length > 0 && (
            <div className="space-y-3">
              <Label>Current Collaborators:</Label>
              {data.collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <UserPlus className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {collaborator.address}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {collaborator.email}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCollaborator(collaborator.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Collaborator */}
          <div className="space-y-3">
            <Label>Add Collaborator:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={newCollaborator.address}
                onChange={(e) =>
                  setNewCollaborator((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="Address"
              />
              <Input
                type="email"
                value={newCollaborator.email}
                onChange={(e) =>
                  setNewCollaborator((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="Email address"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addCollaborator}
              disabled={
                !newCollaborator.address.trim() || !newCollaborator.email.trim()
              }
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Collaborator
            </Button>
          </div>

          {errors.collaborators && (
            <p className="text-sm text-destructive">{errors.collaborators}</p>
          )}
        </div>
      </Card>

      {/* Publishing Options */}
      <Card className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Wand2 className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-xl font-display font-bold">Publishing Options</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">
              Community-Driven Story
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your story will be open to community collaboration. Readers can
              vote on chapter choices and story directions.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Community members can propose chapter choices</li>
              <li>• Voting determines story direction</li>
              <li>• Earn rewards based on story engagement</li>
              <li>• Collaborate with other talented writers</li>
              <li>
                • Voting options from your first chapter will guide the next
                chapter
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CollaboratorsStep;
