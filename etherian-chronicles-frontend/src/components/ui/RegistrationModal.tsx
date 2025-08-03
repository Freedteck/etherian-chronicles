import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { useState } from "react";
import { registerUser } from "@/data/proposalData";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";

const RegistrationModal = ({ isOpen, onClose }) => {
  const [referrer, setReferrer] = useState("");
  const [error, setError] = useState("");
  const account = useActiveAccount();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait while we register you...");
    // if (!/^0x[a-fA-F0-9]{40}$/.test(referrer)) {
    //   setError("Please enter a valid Ethereum address.");
    //   return;
    // }
    // setError("");
    try {
      const transactionHash = await registerUser(referrer, account);
      console.log(transactionHash);
      toast.dismiss(toastId);
      toast.success("Registration successfull");
      onClose();
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error("An unexpected error occured, please try again");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Welcome to Etherian Chronicle</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-muted-foreground">
            <p>
              Thank you for joining Etherian Chronicle — a decentralized
              storytelling community where writers, voters, and collaborators
              shape stories together.
            </p>
            <p>
              To get started, you can enter the wallet address of the person who
              referred you. This is optional but helps grow our community.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referrer">Referrer's Address</Label>
            <Input
              id="referrer"
              placeholder="0x1234...abcd"
              value={referrer}
              onChange={(e) => setReferrer(e.target.value)}
              aria-describedby={error ? "referrer-error" : undefined}
              aria-invalid={!!error}
            />
            {error && (
              <p id="referrer-error" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Skip
            </Button>
            <Button type="submit" className="btn-mystical">
              Register
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;
