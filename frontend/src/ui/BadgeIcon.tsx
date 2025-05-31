import type { ReactNode } from "react";
import { cx } from "../utils/cx";

export const BadgeIcon = (params: {
  icon?: ReactNode;
  children: ReactNode;
  props?: React.HTMLAttributes<HTMLDivElement>;
  className?: string;
}) => {
  return (
    <div
      {...params.props}
      className={cx(
        "px-0.5 py-0.25 rounded-md text-sm",
        "gap-0.25 inline-flex items-center",
        "bg-gray-100 text-gray-800 border",
        params.props?.className,
        params.className
      )}
    >
      {params.icon && <div className="w-4 h-4">{params.icon}</div>}
      {params.children}
    </div>
  );
};