import React, { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box';
import { Container, Typography } from '@mui/material';

import { ToastContainer, toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { LazyLoadImage } from 'react-lazy-load-image-component'
import axios from "axios"
import {
  useAnchorWallet, useConnection, useWallet,
} from "@solana/wallet-adapter-react";
import Link from '@mui/material/Link';

import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui"

interface Props {
  children: React.ReactNode
}

const Layout: FC<Props> = (props) => {
  const router = useRouter();
  const { publicKey, signTransaction } = useWallet()
  const { children } = props

  return (
    <>
      <WalletMultiButton className="blue-wallet-connect-button" />
      <Box>
        {
          children
        }
      </Box>
      <ToastContainer />
    </>
  )
}

export default Layout
