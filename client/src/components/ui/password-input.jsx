import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "../../lib/utils";

export const PasswordInput = React.forwardRef(
  ({ className, toggleAriaLabel = "Toggle password visibility", ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    const type = visible ? "text" : "password";

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={type}
          className={cn("pr-10", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={toggleAriaLabel}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
