import type { ComponentProps } from "react";

export default function ButtonDangerText(props: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={
        "items-center p-1 rounded-lg text-red-800 hover:underline hover:text-red-500 disabled:opacity-30"
        + " " + props.className
      }
    />
  );
}