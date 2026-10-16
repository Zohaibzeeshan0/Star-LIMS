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
import { AlertTriangle, CheckCircle2, XCircle, Info, ShieldAlert, Loader2 } from "lucide-react";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "teal" | "warning" | "default";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <XCircle className="h-5 w-5 text-fail-red" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning-amber" />;
      case "teal":
        return <CheckCircle2 className="h-5 w-5 text-teal-pharma" />;
      default:
        return <Info className="h-5 w-5 text-pharma-blue" />;
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case "danger":
        return "destructive";
      case "teal":
        return "teal";
      case "warning":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full p-2 bg-slate-100 shrink-0">
              {getIcon()}
            </div>
            <div>
              <DialogTitle className="text-base text-pharma-blue">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Citi Pharma Quality Assurance & Compliance Action
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 text-xs text-slate-600 leading-relaxed">
          {description}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={getButtonVariant() as any}
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="font-bold gap-1.5"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
