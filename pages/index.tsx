"use client"
import { ChangeEvent, useEffect, useState } from "react"
import { Manrope } from "next/font/google"
import styles from "@/styles/Home.module.css"
import type { NextPage } from 'next'
import { useAccount, useSignMessage } from 'wagmi'
import { Divider, Box, TextField, Stack, IconButton, Accordion, AccordionSummary, Typography, AccordionDetails, Link } from '@mui/material'
import { TextNormal, TextSubtle, TextSuccess, TextWarning } from '@/Components/StyledComps'
import Head from "next/head"
import SuperButton from "@/Components/SuperButton"
import SuperInput from "@/Components/SuperInput"
import { createPublicClient, http } from "viem"
import { mainnet } from "viem/chains"
import ConnectButton from "@/Components/ConnectButton"
import { ContentCopy, ExpandMore } from "@mui/icons-material"
import Image from "next/image"

const manrope = Manrope({ subsets: ["latin"] })

const Home: NextPage = () => {
  const { address } = useAccount()
  const [signMessage, setSignMessage] = useState<string>('')
  const [signature, setSignature] = useState('')
  const [validationAddress, setValidationAddress] = useState('')
  const [validationSignature, setValidationSignature] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [wasCopied, setWasCopied] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const { signMessageAsync } = useSignMessage()

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http()
  })

  const handleSignMessage = async () => {
    try {
      const sig = await signMessageAsync({ message: signMessage })
      setSignature(sig)
    } catch (error) {
      console.error('Error signing message:', error)
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

  const handleValidateSignature = async () => {
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
    }
  }

  const projectId = process.env?.NEXT_PUBLIC_WC_ID || ''
  useEffect(() => {
    console.info("WC", `${projectId?.slice(0, 4)}...`)
  }, [projectId])

  const handleCopySignature = () => {
    navigator.clipboard.writeText(signature)
    setWasCopied(true)
    setTimeout(() => {
      setWasCopied(false)
    }, 3000)
  }

  return (
    <>
      <Head>
        <title>Account Validator</title>
        <meta name="description" content="Sign any message with web3 and let anyone validate your ownership of an account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <meta name="keywords" content="fantom, sonic, fvm, testnet, transactions, speed, tps, crypto" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Account Validator with Web3 Signature" />
        <meta name="twitter:image" content="" />
        <meta name="twitter:domain" content="sonic.paintswap.io" />
        <meta name="twitter:site" content="@paintoshi" />
        <meta name="twitter:creator" content="@paintoshi" />
        <meta name="twitter:description" content="Sign any message with web3 and let anyone validate your ownership of an account" />

        <meta property="og:title" content="Account Validator with Web3 Signature" />
        <meta property="og:description" content="Sign any message with web3 and let anyone validate your ownership of an account" />
        <meta property="og:image" content="" />
        <meta property="og:url" content="" />
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
                  <TextSubtle textAlign="left">{`A wallet signature is a secure hashed version of the message, public key (account address) and private key, which can be publicly shared. It's how Dapps can validate that someone owns an account. The validation uses `}<Link href="https://www.geeksforgeeks.org/blockchain-elliptic-curve-digital-signature-algorithm-ecdsa/" target="_blank" rel="noopener noreferrer">ECDSA</Link>{` (Elliptic Curve Digital Signature Algorithm) and `}<Link href="https://viem.sh/docs/actions/public/verifyMessage" target="_blank" rel="noopener noreferrer">verifyMessage</Link>{` to prove that the signature was created by the owner of the account.`}</TextSubtle>
                </Typography>
                <Typography component="div" mt={2}><TextNormal textAlign="left">Example</TextNormal></Typography>
                <Typography component="div">
                  <TextSubtle textAlign="left" sx={{ paddingLeft: "16px" }}>
                    <ol>
                      <li>{`You want someone to validate their ownership of an account. You send them a custom message for example "Hello Sir".`}</li>
                      <li>{`The person connects with that account, enters the message, sign and send back the signature to you.`}</li>
                      <li>{`You enter the account, message and signature. If it says valid, you know that the signer has 100% access to that account. Also at that particular time, since they didn't know the message in advance.`}</li>
                    </ol>
                  </TextSubtle>
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
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} width="100%">
                <ConnectButton width="100%" />
                <SuperButton variant="contained" color="primary" width="100%" size="large" onClick={handleSignMessage} disabled={!signMessage || !address}>
                  Sign Message
                </SuperButton>
                <SuperButton variant="contained" color="primary" width="100%" size="large" onClick={handleClearMessage} disabled={!signMessage}>
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
                  {wasCopied && (
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
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} width="100%">
                <SuperButton variant="contained" color="primary" width="100%" size="large" onClick={handleValidateSignature} disabled={!validationAddress || !validationMessage || !validationSignature}>
                  Validate
                </SuperButton>
                <SuperButton variant="contained" color="primary" width="100%" size="large" onClick={handleClearValidation} disabled={!validationAddress && !validationMessage && !validationSignature}>
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
