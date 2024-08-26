"use client"
import React from "react"
import { AbbreviateAddress } from "@/Components/AbbreviateAddress"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount } from "wagmi"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import SuperButton, { SuperButtonProps } from "@/Components/SuperButton"

interface UnlockButtonProps extends SuperButtonProps {
  onClick?: () => void
}

const ConnectButton: React.FC<UnlockButtonProps> = ({ onClick = undefined, ...props }) => {
  const { open } = useWeb3Modal()
  const { address, isConnected, isConnecting } = useAccount()

  return (
    <>
      <SuperButton onClick={() => open()} size="large" variant="contained" endIcon={<AccountBalanceWalletIcon />} loading={isConnecting} {...props}>
        {isConnected ? <AbbreviateAddress address={address} /> : "Connect"}
      </SuperButton>
    </>
  )
}

export default ConnectButton
