"use client"
import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { Manrope } from "next/font/google"
import styles from "@/styles/Home.module.css"
import type { NextPage } from 'next'
import { useAccount, useSignMessage } from 'wagmi'
import { Divider, Box, TextField, Stack, IconButton, Accordion, AccordionSummary, Typography, AccordionDetails, Link } from '@mui/material'
import { TextNormal, TextSubtle, TextSuccess, TextWarning } from '@/Components/StyledComps'
import Head from "next/head"
import SuperButton from "@/Components/SuperButton"
import SuperInput from "@/Components/SuperInput"
import { createPublicClient, http, isAddress } from "viem"
import { mainnet } from "viem/chains"
import ConnectButton from "@/Components/ConnectButton"
import { ContentCopy, ExpandMore } from "@mui/icons-material"
import Image from "next/image"
import styled from "styled-components"
import ClearIcon from '@mui/icons-material/Clear'
import { abbreviateAddressAsString } from "@/helpers/Utilities"

const DONATION = '0x5b36ECcFFAaB547190BAf97dEd7B03E10F83d63f'

const manrope = Manrope({ subsets: ["latin"] })

const SearchClearButton = styled(IconButton)`
  min-width: 14px;
  width: 14px;
  padding: 0;

  :hover {
    filter: brightness(1.2);
  }
`

const Home: NextPage = () => {
  const { address } = useAccount()
  const [signMessage, setSignMessage] = useState<string>('')
  const [signature, setSignature] = useState<string>('')
  const [validationAddress, setValidationAddress] = useState('')
  const [validationSignature, setValidationSignature] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [wasCopiedSignature, setWasCopiedSignature] = useState(false)
  const [wasCopiedCoffee, setWasCopiedCoffee] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isSigning, setIsSigning] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const { signMessageAsync } = useSignMessage()

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http()
  })

  const projectId = process.env?.NEXT_PUBLIC_WC_ID || ''
  useEffect(() => {
    console.info("WC", `${projectId?.slice(0, 4)}...`)
  }, [projectId])

  const handleSignMessage = async () => {
    setIsSigning(true)
    try {
      const sig = await signMessageAsync({ message: signMessage })
      setSignature(sig)
    } catch (error) {
      console.error('Error signing message:', error)
    } finally {
      setIsSigning(false)
    }
  }

  const handleValidateSignature = async () => {
    setIsValidating(true)
    try {
      const valid = await publicClient.verifyMessage({
        address: validationAddress as `0x${string}`,
        message: validationMessage,
        signature: validationSignature as `0x${string}`
      })
      setIsValid(valid)
    } catch (error) {
      console.error('Error validating signature:', error)
      setIsValid(false)
    } finally {
      setIsValidating(false)
    }
  }

  const handleClearMessage = () => {
    setSignMessage('')
    setSignature('')
  }

  const handleClearValidation = () => {
    setValidationAddress('')
    setValidationMessage('')
    setValidationSignature('')
    setIsValid(null)
  }

  const handleCopySignature = () => {
    navigator.clipboard.writeText(signature)
    setWasCopiedSignature(true)
    setTimeout(() => {
      setWasCopiedSignature(false)
    }, 3000)
  }

  const handleCopyCoffee = () => {
    navigator.clipboard.writeText(DONATION)
    setWasCopiedCoffee(true)
    setTimeout(() => {
      setWasCopiedCoffee(false)
    }, 3000)
  }

  // For input address validation
  const helperTextAddress: string = useMemo(() => {
    if (validationAddress.length && !isAddress(validationAddress, { strict: false })) {
      return "Invalid address"
    }
    return ""
  }, [validationAddress])

  // Automatically clear isValid if all inputs are cleared
  useEffect(() => {
    if (!validationAddress?.length && !validationMessage?.length && !validationSignature?.length) {
      setIsValid(null)
    }
  }, [validationAddress, validationMessage, validationSignature])

  return (
    <>
      <Head>
        <title>Account Validator</title>
        <meta name="description" content="Sign any message with web3 and let anyone validate your ownership of an ethereum compatible account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <meta name="keywords" content="fantom, sonic, fvm, testnet, transactions, speed, tps, crypto" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Account Validator with Web3 Signature" />
        <meta name="twitter:image" content="https://auth.cash/og.png" />
        <meta name="twitter:domain" content="auth.cash" />
        <meta name="twitter:site" content="@paintoshi" />
        <meta name="twitter:creator" content="@paintoshi" />
        <meta name="twitter:description" content="Sign any message with web3 and let anyone validate your ownership of an ethereum compatible account" />

        <meta property="og:title" content="Account Validator with Web3 Signature" />
        <meta property="og:description" content="Sign any message with web3 and let anyone validate your ownership of an ethereum compatible account" />
        <meta property="og:image" content="https://auth.cash/og.png" />
        <meta property="og:url" content="https://auth.cash" />
      </Head>
      <main className={`${styles.main} ${manrope.className}`}>
        <div className={styles.center}>
          <div className={styles.mainPanel}>
            <h1 className={styles.title}>Account Validator</h1>
            <p className={styles.titleSub}>
              Sign or validate accounts with Web3<br />
            </p>
            <Accordion style={{ backgroundColor: "transparent" }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <TextNormal textAlign="left">What is this dapp?</TextNormal>
              </AccordionSummary>
              <AccordionDetails>
                <Typography component="div">
                  <TextSubtle textAlign="left" fontSize="14px">{`A wallet signature is a secure hashed version of a message, public key (account address) and private key, which can be publicly shared. It's how Dapps can validate that someone owns an account. The signature uses `}<Link href="https://wagmi.sh/react/api/hooks/useSignMessage" target="_blank" rel="noopener noreferrer">useSignMessage</Link>{`. The validation uses `}<Link href="https://www.geeksforgeeks.org/blockchain-elliptic-curve-digital-signature-algorithm-ecdsa/" target="_blank" rel="noopener noreferrer">ECDSA</Link>{` (Elliptic Curve Digital Signature Algorithm) and `}<Link href="https://viem.sh/docs/actions/public/verifyMessage" target="_blank" rel="noopener noreferrer">verifyMessage</Link>{` to prove that the signature was created by the owner of the account.`}</TextSubtle>
                </Typography>
                <Typography component="div" mt={2}><TextNormal textAlign="left">Example</TextNormal></Typography>
                <Typography component="div">
                  <TextSubtle textAlign="left" fontSize="14px" sx={{ paddingLeft: "24px" }}>
                    <ol>
                      <li>{`You want someone to validate their ownership of an ethereum compatible account. You send them a custom message for example "Hello Sir".`}</li>
                      <li>{`The person connects with that account, enters the message, sign and send back the signature to you.`}</li>
                      <li>{`You enter the account, message and signature. If it says valid, you know that the signer has 100% access to that account. Also at that particular time, since they didn't know the message in advance.`}</li>
                    </ol>
                  </TextSubtle>
                </Typography>
                <Typography component="div" mt={2}><TextSubtle textAlign="left" fontSize="14px">{`Or if you want to prove that you are the owner, just give the instructions to whoever you need to prove it to. It's a higher quality proof if they choose the message.`}</TextSubtle></Typography>
                <Typography component="div" mt={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextNormal fontSize="14px" textAlign="left">{`Donate me a coffee: ${abbreviateAddressAsString(DONATION)}`}</TextNormal>
                    <IconButton color="primary" size="small" onClick={handleCopyCoffee}>
                      <ContentCopy />
                    </IconButton>
                  </Stack>
                  {wasCopiedCoffee && (
                    <Box>
                      <TextSuccess fontSize="14px" textAlign="left">
                        Copied!
                      </TextSuccess>
                    </Box>
                  )}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Box width="100%" mt="16px" mb="24px">
              <Divider />
            </Box>
            <Stack width="100%" direction="column" spacing={2}>
              <TextSubtle>
                Connect wallet to sign any message with your account
              </TextSubtle>
              <SuperInput
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setSignMessage(e.target.value as `0x${string}`)
                }}
                value={signMessage}
                fullWidth
                label="Message"
                variant="outlined"
                mode="text"
                placeholder="Any message"
                disableReturn
                endAdornment={
                  <SearchClearButton
                    size="medium"
                    disabled={!signMessage.length}
                    onClick={() => setSignMessage('')}
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                  >
                    <ClearIcon />
                  </SearchClearButton>
                }
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} width="100%">
                <ConnectButton width="100%" />
                <SuperButton variant="contained" color="primary" width="100%" size="large" onClick={handleSignMessage} disabled={!signMessage?.length || !address?.length || isSigning} loading={isSigning}>
                  Sign Message
                </SuperButton>
                <SuperButton variant="contained" color="primary" width="100%" size="large" onClick={handleClearMessage} disabled={!signMessage?.length && !signature?.length}>
                  Clear
                </SuperButton>
              </Stack>

              <Stack width="100%" direction="column">
                <Stack direction="row" spacing={1} width="100%" justifyContent="center" alignItems="center" position="relative">
                  <TextNormal>
                    Output Signature
                  </TextNormal>
                  <IconButton color="primary" size="small" onClick={handleCopySignature} disabled={!signature}>
                    <ContentCopy />
                  </IconButton>
                  {wasCopiedSignature && (
                    <Box position="absolute" top="6px" right="0">
                      <TextSuccess fontSize="14px">
                        Copied!
                      </TextSuccess>
                    </Box>
                  )}
                </Stack>
                <TextField
                  value={signature ? signature : ""}
                  disabled
                  fullWidth
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                />
              </Stack>
            </Stack>
            <Box width="100%" mt="24px" mb="24px">
              <Divider />
            </Box>
            <Stack width="100%" direction="column" spacing={2}>
              <TextSubtle>
                Validate ownership of an account using a message and signature
              </TextSubtle>
              <SuperInput
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setValidationAddress(e.target.value as `0x${string}`)
                }}
                value={validationAddress}
                fullWidth
                label="Account to validate"
                variant="outlined"
                mode="text"
                placeholder="0x...123"
                disableReturn
                endAdornment={
                  <SearchClearButton
                    size="medium"
                    disabled={!validationAddress.length}
                    onClick={() => setValidationAddress('')}
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                  >
                    <ClearIcon />
                  </SearchClearButton>
                }
                error={helperTextAddress?.length > 0}
                helperText={helperTextAddress}
              />
              <SuperInput
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setValidationMessage(e.target.value as `0x${string}`)
                }}
                value={validationMessage}
                fullWidth
                label="Message to validate"
                variant="outlined"
                mode="text"
                placeholder="Any message"
                disableReturn
                endAdornment={
                  <SearchClearButton
                    size="medium"
                    disabled={!validationMessage.length}
                    onClick={() => setValidationMessage('')}
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                  >
                    <ClearIcon />
                  </SearchClearButton>
                }
              />
              <SuperInput
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  setValidationSignature(e.target.value as `0x${string}`)
                }}
                value={validationSignature}
                fullWidth
                label="Signature to validate"
                variant="outlined"
                mode="text"
                placeholder="0x...123"
                disableReturn
                endAdornment={
                  <SearchClearButton
                    size="medium"
                    disabled={!validationSignature.length}
                    onClick={() => setValidationSignature('')}
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                  >
                    <ClearIcon />
                  </SearchClearButton>
                }
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} width="100%">
                <SuperButton variant="contained" color="primary" width="100%" size="large" onClick={handleValidateSignature}
                  disabled={!validationAddress?.length || !validationMessage?.length || !validationSignature?.length || isValidating || helperTextAddress?.length > 0}
                  loading={isValidating}
                >
                  Validate
                </SuperButton>
                <SuperButton variant="contained" color="primary" width="100%" size="large" onClick={handleClearValidation} disabled={!validationAddress?.length && !validationMessage?.length && !validationSignature?.length}>
                  Clear
                </SuperButton>
              </Stack>
              {isValid !== null && (
                isValid ? <TextSuccess fontSize="24px">Valid Signature!</TextSuccess> : <TextWarning fontSize="24px">Invalid Signature</TextWarning>
              )}
            </Stack>
            <Link className={styles.githubLink} href="https://github.com/paintoshi/account-validator" target="_blank" rel="noopener noreferrer"><Image src="/images/github.svg" className={styles.githubImage} alt="Github" width={32} height={32} /></Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
