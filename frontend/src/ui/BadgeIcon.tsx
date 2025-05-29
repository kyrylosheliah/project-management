import type { ReactNode } from "react";
import { cx } from "../utils/cx";

export const BadgeIcon = (params: {
  icon: ReactNode;
  children: ReactNode;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) => {
  return (
    <div
      {...params.props}
      className={cx(
        "px-0.5 py-0.25 rounded-md text-sm",
        "gap-0.25 inline-flex items-center",
        "bg-gray-100 text-gray-800 border border-gray-300"
      )}
    >
      <div className="w-4 h-4">{params.icon}</div>
      {params.children}
    </div>
  );
};