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
import { AlertTriangle, CheckCircle2, XCircle, Info, Sparkles, ShieldAlert } from "lucide-react";

interface TestConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "teal" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function TestConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: TestConfirmDialogProps) {
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
              <DialogTitle className="text-base text-pharma-blue font-heading font-bold">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Citi Pharma Laboratory Quality Control Governance
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 text-xs text-slate-600 leading-relaxed">
          {description}
        </div>

        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Demonstration QC Mode:</strong> Actions are recorded in mock memory and simulate 21 CFR Part 11 audit trail event creation.
          </span>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={getButtonVariant() as any}
            size="sm"
            onClick={onConfirm}
            className="font-bold gap-1.5"
          >
            {variant === "teal" && <Sparkles className="h-3.5 w-3.5" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
