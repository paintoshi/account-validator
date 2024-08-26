"use client"
import React from "react"
import { Button, ButtonProps, Tooltip, CircularProgress, Theme } from "@mui/material"
import Link from "next/link"
import { styled } from "@mui/material/styles"

export interface SuperButtonProps extends ButtonProps {
  href?: string // not needed if using onClick
  externalLink?: boolean // forces <a> tag and target="_blank"
  rotate?: number // rotates the svg in degrees
  fullBelowBreakpoint?: boolean // Ensure this is correctly typed
  tooltip?: string
  tooltipPlacement?: React.ComponentProps<typeof Tooltip>["placement"]
  iconWidth?: string
  iconHeight?: string
  loading?: boolean
  loadingPosition?: "start" | "end" | "center"
  width?: string // Explicitly included
  height?: string // Explicitly included
  variant?: "contained" | "outlined" | "text"
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) =>
    typeof prop === "string" && !["rotate", "iconWidth", "iconHeight", "fullBelowBreakpoint", "width", "height", "ant"].includes(prop),
})<SuperButtonProps>`
  border-radius: 10px;
  text-transform: capitalize;
  pointer-events: auto !important;
  &:hover {
    cursor: pointer;
  }
  & svg {
    ${({ rotate }) => rotate && `transform: rotate(${rotate}deg);`}
    ${({ iconWidth }) => iconWidth && `width: ${iconWidth};`}
    ${({ iconHeight }) => iconHeight && `height: ${iconHeight};`}
  }
  ${({ theme, variant, color }) =>
    variant === "contained" &&
    `
    & path {
      fill: ${getColor(theme, color)};
    }
  `}
  ${({ variant }) =>
    variant === "outlined" &&
    `
    &:hover {
      border: 1px solid #c0d6f7;
    }
  `}
  ${({ height }) => height && `height: ${height};`}
  ${({ fullBelowBreakpoint, width }) =>
    fullBelowBreakpoint
      ? `
    width: 100%;
  `
      : width &&
        `
    width: ${width};
  `}
`

function getColor(theme: Theme, color: string | undefined) {
  if (typeof color === "string" && color in theme.palette) {
    return (theme.palette as any)[color].contrastText
  }
  return theme.palette.primary.contrastText
}

export const StyledCircularProgress = styled(CircularProgress)`
  svg {
    color: ${({ theme }) => theme.palette.subtle.main};
  }
`

const SuperButton: React.FC<SuperButtonProps> = ({
  children,
  href,
  externalLink,
  rotate,
  iconWidth,
  iconHeight,
  loading,
  loadingPosition = "start",
  tooltip,
  tooltipPlacement,
  width,
  height,
  fullBelowBreakpoint,
  variant = "contained",
  ...buttonProps
}) => {
  // Only use Link or anchor tag if `href` is provided
  const linkProps = href ? (externalLink ? { href, target: "_blank", component: "a" as const } : { href, component: Link }) : {}

  return (
    <Tooltip title={tooltip || ""} placement={tooltipPlacement}>
      <StyledButton
        {...buttonProps}
        {...linkProps}
        rotate={rotate}
        iconWidth={iconWidth}
        iconHeight={iconHeight}
        height={height}
        width={width}
        fullBelowBreakpoint={fullBelowBreakpoint}
        startIcon={loading && (loadingPosition === "start" || loadingPosition === "center") ? <StyledCircularProgress size="1rem" /> : buttonProps.startIcon}
        endIcon={loading && loadingPosition === "end" ? <StyledCircularProgress size="1rem" /> : buttonProps.endIcon}
        variant={variant}
      >
        {children}
      </StyledButton>
    </Tooltip>
  )
}

export default SuperButton
