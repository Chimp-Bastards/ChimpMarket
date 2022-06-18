import React, { FC } from 'react'
import { useRouter } from 'next/router'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import * as anchor from "@project-serum/anchor"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios"
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui"
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";

import {
  useAnchorWallet, useConnection, useWallet,
} from "@solana/wallet-adapter-react";

import { useEffect, useState } from "react";
import { makeStyles } from '@mui/styles';

import { Container } from '@mui/material'
import TicketsModal from 'components/TicketsModal'

interface Props {
  nextRound: any
  tokenPrice: any
  MATCH_OPTION: any
  setLoading: any
  nextTickets: any
  setNextTickets: any
}

const Roundbar: FC<Props> = (props) => {
  const { nextRound, tokenPrice, MATCH_OPTION, setLoading, nextTickets, setNextTickets } = props

  const [openViewTicketsModal, setOpenViewTicketsModal] = useState(false)
  const [tickets, setTickets] = useState<any>([])
  const { publicKey, signTransaction } = useWallet()

  const [timer, setTimer] = useState(1)

  const headers = {
    "Access-Control-Allow-Origin": "*"
  }
  
  useEffect(() => {
    if (publicKey) {
      const getNextRoundTickets = async () => {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/next-round-tickets`, {
          walletAddress: publicKey.toString(),
        }, { headers })

        if (data.nextTickets) {
          setTickets(data.nextTickets)
          setNextTickets(data.nextTickets)
        }
      }
      getNextRoundTickets()
    }
  }, [publicKey, nextRound.number])

  return (
    <>
      <Box className='roundbar-wrapper'>
        <Container>
          <Grid container spacing={2}>
            <Grid item md={10} sm={12} xs={12}>
              <Box style={{ position: 'relative' }}>
                <Box className='detail-content'>
                  <Typography className='title' style={{ textAlign: 'left', marginLeft: '23%' }}>POT DETAILS</Typography>
                  <Typography className='round-title' style={{ textAlign: 'left', marginLeft: '23%' }}>Round {nextRound.number}</Typography>
                  <Box sx={{ px: 5 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', pt: 3 }} style={{ textAlign: 'center' }}>
                          <Typography className='subtitle'>match first 1</Typography>
                          <Typography className='subtitle2'>{Math.floor((nextRound.prize * MATCH_OPTION[1]) * 100) / 100.0} $Bones</Typography>
                          <Typography className='subtitle3'>~{Math.floor((nextRound.prize * MATCH_OPTION[1] * tokenPrice) * 100) / 100.0}$</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', pt: 3 }} style={{ textAlign: 'center' }}>
                          <Typography className='subtitle'>match first 2</Typography>
                          <Typography className='subtitle2'>{Math.floor((nextRound.prize * MATCH_OPTION[2]) * 100) / 100.0} $Bones</Typography>
                          <Typography className='subtitle3'>~{Math.floor((nextRound.prize * MATCH_OPTION[2] * tokenPrice) * 100) / 100.0}$</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', pt: 3 }} style={{ textAlign: 'center' }}>
                          <Typography className='subtitle'>match first 3</Typography>
                          <Typography className='subtitle2'>{Math.floor((nextRound.prize * MATCH_OPTION[3]) * 100) / 100.0} $Bones</Typography>
                          <Typography className='subtitle3'>~{Math.floor((nextRound.prize * MATCH_OPTION[3] * tokenPrice) * 100) / 100.0}$</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', pt: 3 }} style={{ textAlign: 'center' }}>
                          <Typography className='subtitle'>match first 4</Typography>
                          <Typography className='subtitle2'>{Math.floor((nextRound.prize * MATCH_OPTION[4]) * 100) / 100.0} $Bones</Typography>
                          <Typography className='subtitle3'>~{Math.floor((nextRound.prize * MATCH_OPTION[4] * tokenPrice) * 100) / 100.0}$</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', pt: 3 }} style={{ textAlign: 'center' }}>
                          <Typography className='subtitle'>match first 5</Typography>
                          <Typography className='subtitle2'>{Math.floor((nextRound.prize * MATCH_OPTION[5]) * 100) / 100.0} $Bones</Typography>
                          <Typography className='subtitle3'>~{Math.floor((nextRound.prize * MATCH_OPTION[5] * tokenPrice) * 100) / 100.0}$</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', pt: 3 }} style={{ textAlign: 'center' }}>
                          <Typography className='subtitle' style={{ color: '#EA5556' }}>Burn</Typography>
                          <Typography className='subtitle2'>{Math.floor((nextRound.prize * 0.2) * 100) / 100.0} $Bones</Typography>
                          <Typography className='subtitle3'>~{Math.floor((nextRound.prize * 0.2 * tokenPrice) * 100) / 100.0}$</Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', flexDirection: 'column', py: 2 }} style={{ textAlign: 'center' }}>
                      <Typography className='subtitle'>match ALL 6</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }} style={{ textAlign: 'center' }}>
                        <Box>
                          <Typography className='subtitle2'>{Math.floor((nextRound.prize * MATCH_OPTION[6]) * 100) / 100.0} $Bones</Typography>
                          <Typography className='subtitle3'>~{Math.floor((nextRound.prize * MATCH_OPTION[6] * tokenPrice) * 100) / 100.0}$</Typography>
                        </Box>
                        <Box sx={{ px: 3 }}>
                          <Typography variant='h3' className="text-dark-green">+</Typography>
                        </Box>
                        <Box>
                          <Typography className='subtitle2'>BLUE CHIP NFT</Typography>
                          <Typography className='subtitle2'>PRIZE POOL</Typography>
                        </Box>
                      </Box>
                    </Box>
                    {
                      publicKey && (
                        nextTickets.length > 0 && (
                          <Box className='text-center' sx={{ py: 4 }}>
                            <Button onClick={() => {
                              setOpenViewTicketsModal(true)
                            }}><LazyLoadImage src="see_tickets.png" style={{ width: '170px' }}/></Button>
                          </Box>
                        )
                      )
                    }
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item md={2} sm={0} xs={0}>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <TicketsModal
        open={openViewTicketsModal}
        handleClose={() => setOpenViewTicketsModal(false)}
        tickets={tickets}
        setTickets={setTickets}
        setLoading={setLoading}
        nextRound={nextRound}
      />
    </>
  )
}

export default Roundbar

