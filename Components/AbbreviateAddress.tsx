import { firstFew, lastFew } from "@/helpers/Utilities"
import Link from "next/link"
import React from "react"
import { getAddress } from "viem"

interface Props {
  address: `0x${string}` | undefined
  href?: string | null
  numChars?: number
}

/**
 * @param address expected to be a valid address
 * @param href - optional href to wrap the address in a link
 * @param numChars - number of characters to abbreviate the address to
 * @returns
 * - empty component if address is invalid
 * - Abbreviated address otherwise
 */
export const AbbreviateAddress: React.FC<Props> = ({ address, href = null, numChars = 4 }) => {
  try {
    if (!address) {
      return null
    }
    const checkSumedAddress = getAddress(address)
    const children = (
      <>
        {firstFew(checkSumedAddress, numChars + 1)}&hellip;
        <span style={{ paddingLeft: "2px" }}>{lastFew(checkSumedAddress, numChars)}</span>
      </>
    )
    return href ? <Link href={href}>{children}</Link> : children
  } catch {
    return null
  }
}
