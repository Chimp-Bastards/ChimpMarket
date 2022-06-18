import React, { FC } from 'react'
import clsx from 'clsx'

import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui"

interface Props {
  showFooter?: boolean
}

const Header: FC<Props> = (props) => {
  const router = useRouter();
  const { showFooter } = props

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
      <Button onClick={() => router.push('/raffles')} style={{ color: router.pathname === '/raffles' ? '#37e486' : '#7f7a71', backgroundColor: router.pathname === '/raffles' ? '#16462f' : 'none' }} sx={{ p: 2 }}>
        Raffles
      </Button>
      <Button onClick={() => router.push('/auctions')} style={{ color: router.pathname.split('/')[1] === 'auctions' ? '#37e486' : '#7f7a71', backgroundColor: router.pathname.split('/')[1] === 'auctions' ? '#16462f' : 'none' }} sx={{ p: 2 }}>
        Auctions
      </Button>
    </Box>
  )
}

export default Header
