import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getDailyLimitMessage } from "@/lib/subscription";

interface FocusLimitPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FocusLimitPopup: React.FC<FocusLimitPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate("/upgrade");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Dagelijkse limiet bereikt
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {getDailyLimitMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose} className="w-full sm:w-auto">
            Sluiten
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpgrade}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
          >
            Upgrade naar Pro
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
