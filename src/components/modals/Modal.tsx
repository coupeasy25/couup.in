"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
  className,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={className || "sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="relative p-6 flex-auto max-h-[65vh] overflow-y-auto">
          {body}
        </div>
        <div className="flex flex-col gap-2 p-6">
          <div className="flex flex-row items-center gap-4 w-full">
            {secondaryAction && secondaryActionLabel && (
              <Button 
                disabled={disabled} 
                onClick={handleSecondaryAction}
                variant="outline"
                className="w-full"
              >
                {secondaryActionLabel}
              </Button>
            )}
            <Button 
              disabled={disabled} 
              onClick={handleSubmit}
              className="w-full bg-[#F97316] hover:bg-[#F97316]/90 text-white"
            >
              {actionLabel}
            </Button>
          </div>
          {footer}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
