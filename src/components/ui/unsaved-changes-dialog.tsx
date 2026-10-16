"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export interface UnsavedChangesDialogProps {
  open?: boolean;
  isOpen?: boolean;
  onConfirmDiscard?: () => void;
  onDiscard?: () => void;
  onCancelStay?: () => void;
  onStay?: () => void;
}

export function UnsavedChangesDialog({
  open,
  isOpen,
  onConfirmDiscard,
  onDiscard,
  onCancelStay,
  onStay,
}: UnsavedChangesDialogProps) {
  const isDialogOpen = open !== undefined ? open : !!isOpen;
  const handleDiscard = onConfirmDiscard || onDiscard || (() => {});
  const handleStay = onCancelStay || onStay || (() => {});

  return (
    <Dialog open={isDialogOpen} onOpenChange={(v) => !v && handleStay()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full p-2 bg-amber-50 text-warning-amber shrink-0 border border-amber-200">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base text-pharma-blue">
                Unsaved Form Modifications
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Data Integrity Notice
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 text-xs text-slate-600 leading-relaxed">
          You have unsaved changes in this form. If you close this window now, any entered values or monograph test parameters will be lost. Are you sure you want to discard your changes?
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={handleStay}>
            Keep Editing
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDiscard}
            className="font-bold"
          >
            Discard Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
