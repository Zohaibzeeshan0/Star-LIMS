import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SampleStatus } from "@/lib/types/sample";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        pass: "border border-teal-pharma/30 bg-teal-pharma-light text-teal-pharma-dark font-bold",
        fail: "border border-fail-red/30 bg-fail-red-light text-fail-red-dark font-bold",
        quarantine: "border border-warning-amber/40 bg-warning-amber-light text-warning-amber-dark font-bold",
        testing: "border border-blue-500/30 bg-blue-50 text-blue-700 font-semibold",
        review: "border border-purple-500/30 bg-purple-50 text-purple-700 font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export function StatusBadge({ status }: { status: SampleStatus | string }) {
  if (status === "Pass/Released") {
    return (
      <Badge variant="pass">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-pharma" />
        Pass / Released
      </Badge>
    );
  }
  if (status === "Fail/Rejected") {
    return (
      <Badge variant="fail">
        <span className="w-1.5 h-1.5 rounded-full bg-fail-red" />
        Fail / Rejected
      </Badge>
    );
  }
  if (status === "Quarantine/Retest") {
    return (
      <Badge variant="quarantine">
        <span className="w-1.5 h-1.5 rounded-full bg-warning-amber" />
        Quarantine / Retest
      </Badge>
    );
  }
  if (status === "In Testing") {
    return (
      <Badge variant="testing">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        In Testing
      </Badge>
    );
  }
  return (
    <Badge variant="review">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
      {status}
    </Badge>
  );
}

export { Badge, badgeVariants };
