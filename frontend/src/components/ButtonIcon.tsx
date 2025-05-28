import type { ComponentProps } from "react";
import { cx } from "../utils/cx";

type ButtonIconType = undefined | "danger";

const styleButtonIcon = (type: ButtonIconType) => {
  switch (type) {
    case "danger":
      return "text-red-500";
    case undefined:
      return "text-white";
  }
};

export default function ButtonIcon(params: {
  props?: ComponentProps<"button">;
  type?: ButtonIconType;
  children: React.ReactNode,
  className: string;
}) {
  return (
    <button
      {...params.props}
      className={cx(
        "text-white font-medium text-sm text-nowrap",
        "relative text-center flex items-center justify-center",
        "p-2.5 rounded-lg",
        "bg-gray-700 hover:bg-black disabled:opacity-30",
        "",
        styleButtonIcon(params.type),
        params.className,
        params.props && params.props.className
      )}
    >
      <div className="absolute left-0 top-0 right-0 bottom-0 flex justify-center items-center">
        {params.children}
      </div>
    </button>
  );
}