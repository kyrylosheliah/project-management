import React, {
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { cx } from "../utils/cx";

export const Checkbox: React.FC<{
  className?: string;
  attributes?: InputHTMLAttributes<HTMLInputElement>;
  valid?: boolean;
  indeterminate?: boolean;
}> = (params) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [checked, setChecked] = useState(params.attributes?.checked || false);

  useEffect(() => {
    const handleClick = () => {
      if (params.attributes?.checked === undefined) {
        const current = inputRef.current;
        if (current) {
          current.checked = !current.checked;
          setChecked(current.checked);
        }
      }
      if (params.attributes?.onClick) {
        inputRef.current?.click();
      }
    };

    const button = buttonRef.current;
    if (button) {
      button.addEventListener("click", handleClick);
    }

    return () => {
      if (button) {
        button.removeEventListener("click", handleClick);
      }
    };
  }, [params.attributes]);

  useEffect(() => {
    if (inputRef.current && params.indeterminate !== undefined) {
      inputRef.current.indeterminate = params.indeterminate;
      if (params.indeterminate) {
        inputRef.current.checked = false;
        setChecked(false);
      }
    }
  }, [params.indeterminate]);

  useEffect(() => {
    if (params.attributes?.checked !== undefined) {
      const state = params.attributes.checked;
      if (inputRef.current) {
        inputRef.current.checked = state;
        setChecked(state);
      }
    }
  }, [params.attributes?.checked]);

  const invalid = params.valid !== undefined && params.valid === false;
  const disabled = params.attributes?.disabled;

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      className={cx(
        params.className,
        invalid
          ? "text-red"
          : params.indeterminate
            ? "text-black"
            : disabled
              ? "text-gray-300"
              : "text-black",
        invalid
          ? "border-red"
          : checked
            ? "border-black"
            : "border-gray-300",
        "relative border w-6 h-6 shrink-0 rounded-md",
      )}
    >
      <input
        ref={inputRef}
        {...params.attributes}
        type="checkbox"
        className="appearance-none"
      />
      <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
        {params.indeterminate ? (
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14"
            />
          </svg>
        ) : (
          params.attributes?.checked && (
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 11.917 9.724 16.5 19 7.5"
              />
            </svg>
          )
        )}
      </div>
    </button>
  );
};
