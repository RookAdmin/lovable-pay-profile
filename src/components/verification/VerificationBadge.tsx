
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { VerificationType } from "@/types/verification";

interface VerificationBadgeProps {
  isVerified: boolean;
  category?: VerificationType;
  className?: string;
  showTooltip?: boolean;
  size?: "sm" | "md" | "lg";
}

const categoryLabel: Record<VerificationType, string> = {
  individual: "Individual",
  proprietorship: "Proprietorship",
  private_limited: "Private Limited",
  llp: "LLP",
  corporation: "Corporation"
};

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  isVerified,
  category,
  className,
  showTooltip = true,
  size = "md"
}) => {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const badge = (
    <Badge 
      className={cn(
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium flex items-center gap-1",
        sizeClasses[size],
        className
      )}
    >
      <img 
        src="/lovable-uploads/1b205c8b-1ee9-4b09-bc83-bd90bdd9794b.png" 
        alt="Verified" 
        className="h-3 w-3" 
      />
      {category ? `Verified ${categoryLabel[category]}` : "Verified"}
    </Badge>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p>{category ? 
            `${categoryLabel[category]} verification approved` : 
            "Account verified"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationBadge;
