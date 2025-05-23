import type { ComponentProps } from "react";

export default function ButtonText(props: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={
        "items-center p-1 rounded-lg text-nowrap text-gray-600 underline hover:text-black disabled:opacity-30"
        + " " + props.className
      }
    />
  );
}