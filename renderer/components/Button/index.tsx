"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

import Icon from "@/components/Icon";
import cn from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "light";
  icon?: string;
  iconPosition?: "r" | "l";
  squared?: boolean;
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

const primaryClassNames =
  "bg-rose-600 text-white fill-white enabled:hover:bg-rose-700 enabled:hover:border-rose-700";
const secondaryClassNames =
  "text-rose-600 fill-rose-600 bg-transparent enabled:hover:bg-rose-100";
const lightClassNames = `${secondaryClassNames} border-none`;

const Button = (props: ButtonProps) => {
  const {
    variant = "primary",
    loading,
    loadingText,
    icon,
    iconPosition = "l",
    squared,
    disabled,
    children,
    className,
    ...restProps
  } = props;

  const styles = {
    [primaryClassNames]: variant === "primary",
    [secondaryClassNames]: variant === "secondary",
    [lightClassNames]: variant === "light",
    "opacity-60": disabled || loading,
    "min-w-[80px] px-4 py-2": !squared,
    "min-w-[36px] w-9 min-h-[36px] h-9": squared,
  };

  const renderIcon = icon && !loading && !squared && (
    <Icon icon={icon} className="h-5 w-5 text-current" />
  );

  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded border border-rose-600  text-sm font-medium  outline-none transition-all disabled:cursor-not-allowed",
        styles,
        className
      )}
      type={!restProps.type ? "button" : restProps.type}
      disabled={disabled || loading}
      {...restProps}
    >
      {iconPosition === "l" && renderIcon}
      <span className="flex items-center justify-center gap-2 font-semibold">
        {loading && !squared && (
          <Icon icon="spinner" className="h-5 w-5 animate-spin text-current" />
        )}
        {loading && loadingText ? loadingText : children}
      </span>
      {iconPosition === "r" && renderIcon}
    </button>
  );
};

export default Button;
