import * as React from "react";

import { cn } from "~/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "aria-[invalid=true]:border-red-500",
        "aria-[invalid=true]:focus-visible:ring-red-500",
        className
      )}
      {...props}
    />
  );
}

export { Input };
