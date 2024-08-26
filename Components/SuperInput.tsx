import React, { useEffect } from 'react'
import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledGameInput = styled(TextField)`
  border-radius: 8px;

  fieldset {
    border-radius: 8px;
  }
`

type Props = {
  min: number
  max: number
  startAdornment: React.ReactNode
  endAdornment: React.ReactNode
  mode: 'text' | 'numeric' | 'search' | 'email' | 'tel' | 'url' | 'none' | 'decimal'
  disableReturn: boolean
  disabledShift: boolean
  error: boolean
  onEnter: () => void
  onEscape: () => void
  [key: string]: any
}

const SuperInput = React.forwardRef<HTMLInputElement, Props>(function GameInputRef(props, ref: any) {
  const {
    min,
    max,
    startAdornment,
    endAdornment,
    mode = 'numeric',
    disableReturn = false,
    disabledShift = false,
    error = null,
    onEnter,
    onEscape,
    ...rest
  } = props

  const inputProps = {
    inputMode: mode,
    min,
    max,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && (!e.shiftKey || (e.shiftKey && disabledShift)) && disableReturn) {
        e.preventDefault()
        if (onEnter) {
          onEnter()
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        if (onEscape) {
          onEscape()
        }
      }
    },
  }

  // Set cursor to end of input on focus
  useEffect(() => {
    const inputElement = ref?.current

    const focusHandler = () => {
      if (inputElement) {
        const { length } = inputElement.value
        inputElement.setSelectionRange(length, length)
      }
    }

    if (inputElement) {
      inputElement.addEventListener('focus', focusHandler)
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('focus', focusHandler)
      }
    }
  }, [ref])

  return (
    <StyledGameInput
      inputProps={inputProps}
      InputProps={{ startAdornment, endAdornment }}
      InputLabelProps={{ shrink: true }}
      size="small"
      error={!!error}
      inputRef={ref}
      {...rest}
    />
  )
})

export default SuperInput
