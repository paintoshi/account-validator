import { CircularProgress, styled } from "@mui/material"

interface TextProps {
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export const TextNormal = styled('div')<TextProps>(({ theme, fontSize = "16px", textAlign = "center" }) => ({
  fontSize,
  fontWeight: 400,
  textAlign,
  color: theme.palette.secondary.main,
}));

export const TextSubtle = styled('div')<TextProps>(({ theme, fontSize = "16px", textAlign = "center" }) => ({
  fontSize,
  fontWeight: 400,
  textAlign,
  color: theme.palette.subtle.main,
}))

export const TextSuccess = styled('div')<TextProps>(({ theme, fontSize = "16px", textAlign = "center" }) => ({
  fontSize,
  fontWeight: 400,
  textAlign,
  color: theme.palette.success.main,
}));

export const TextWarning = styled('div')<TextProps>(({ theme, fontSize = "16px", textAlign = "center" }) => ({
  fontSize,
  fontWeight: 400,
  textAlign,
  color: theme.palette.warning.main,
}))

export const StyledCircularProgress = styled(({ ...rest }) => <CircularProgress size="1rem" {...rest} />)`
  svg {
    color: ${({ theme }) => theme.palette.secondary.main};
  }
`
