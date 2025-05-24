import type { ComponentProps } from "react";
import { cx } from "../utils/cx";

type ButtonType = undefined | "danger";

const styleButton = (type: ButtonType) => {
  switch (type) {
    case "danger":
      return "text-red-800 hover:text-red-500";
    case undefined:
      return "text-gray-600 hover:text-black";
  }
};

export default function ButtonText(props: {
  props: ComponentProps<"button">;
  type?: ButtonType;
  children: React.ReactNode,
}) {
  return (
    <button
      {...props.props}
      className={cx(
        "items-center p-1 rounded-lg text-nowrap disabled:opacity-30 underline",
        styleButton(props.type),
        props.props.className
      )}
      children={props.children}
    />
  );
}