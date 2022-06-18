import React, { FC, useState, useEffect } from 'react'
import clsx from 'clsx'

import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Grid from '@mui/material/Grid'
import { IconButton } from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import CoolDownTimer from 'components/CoolDownTimer'

import Input from '@mui/material/Input';
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { NFT, NFTmap } from "types/metadata"

import { ToastContainer, toast, Zoom } from 'react-toastify'

import { Transaction, PublicKey, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount } from 'utills/getOrCreateAssociatedTokenAccount'
import { createTransferInstruction } from 'utills/createTransferInstructions'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import axios from "axios"

interface Props {
  open: boolean
  handleClose: () => void
  tickets: any
  setTickets: any
  setLoading: any
  pastRound: any
}

const PastTicketsModal: FC<Props> = (props) => {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()

  const {
    open,
    handleClose,
    tickets,
    setTickets,
    setLoading,
    pastRound,
  } = props

  const [winning, setWinning] = useState<any>({})

  // const samoses: NFTmap[] = Object.values(nftsList)

  // samoses.sort((a: any, b: any) => {
  //   return a.NFT.name.split("#")[1] - b.NFT.name.split("#")[1]
  // })

  const [ticketCount, setTicketCount] = useState<number>(1);

  const headers = {
    "Access-Control-Allow-Origin": "*"
  }

  const renderSeries = (value: any) => {
    var s = value + "";
    while (s.length < 6) s = "0" + s;
    return s;
  }

  useEffect(() => {
    if (publicKey) {
      const getPastRoundTickets = async () => {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/past-round-tickets`, {
          walletAddress: publicKey.toString(),
          roundNumber: pastRound.number,
        }, { headers })

        if (data.pastTickets) {
          setTickets(data.pastTickets)
        }

        if (data.winning) {
          setWinning(data.winning)
        }
      }
      getPastRoundTickets()
    }
  }, [open])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="pick-modal-body">
        <Box className="modalContent">
          <Typography variant="h5" className="modalTitle">
            Round {pastRound.number}
          </Typography>
          <IconButton className="closeBtn" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' style={{ color: 'white', WebkitTextStroke: '2px black', fontSize: '25px' }}>WINNING NUMBER</Typography>
            </Box>
            <Box>
              <Grid container style={{ margin: '20px 0px' }}>
                <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                  <LazyLoadImage src="Bones1.png" style={{ width: '90%' }} />
                  <Typography style={{ fontFamily: 'Luckiest Guy', color: '#EAE8DF', WebkitTextStroke: '1px black', position: 'absolute', top: '20%', right: '44%' }}>{pastRound.series ? pastRound.series[0] : ''}</Typography>
                </Grid>
                <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                  <LazyLoadImage src="Bones2.png" style={{ width: '90%' }} />
                  <Typography style={{ fontFamily: 'Luckiest Guy', color: '#EAE8DF', WebkitTextStroke: '1px black', position: 'absolute', top: '20%', right: '44%' }}>{pastRound.series ? pastRound.series[1] : ''}</Typography>
                </Grid>
                <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                  <LazyLoadImage src="Bones3.png" style={{ width: '90%' }} />
                  <Typography style={{ fontFamily: 'Luckiest Guy', color: '#EAE8DF', WebkitTextStroke: '1px black', position: 'absolute', top: '20%', right: '44%' }}>{pastRound.series ? pastRound.series[2] : ''}</Typography>
                </Grid>
                <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                  <LazyLoadImage src="Bones4.png" style={{ width: '90%' }} />
                  <Typography style={{ fontFamily: 'Luckiest Guy', color: '#EAE8DF', WebkitTextStroke: '1px black', position: 'absolute', top: '20%', right: '44%' }}>{pastRound.series ? pastRound.series[3] : ''}</Typography>
                </Grid>
                <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                  <LazyLoadImage src="Bones5.png" style={{ width: '90%' }} />
                  <Typography style={{ fontFamily: 'Luckiest Guy', color: '#EAE8DF', WebkitTextStroke: '1px black', position: 'absolute', top: '20%', right: '44%' }}>{pastRound.series ? pastRound.series[4] : ''}</Typography>
                </Grid>
                <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                  <LazyLoadImage src="Bones6.png" style={{ width: '90%' }} />
                  <Typography style={{ fontFamily: 'Luckiest Guy', color: '#EAE8DF', WebkitTextStroke: '1px black', position: 'absolute', top: '20%', right: '44%' }}>{pastRound.series ? pastRound.series[5] : ''}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' style={{ color: 'white', WebkitTextStroke: '2px black', fontSize: '25px' }}>YOUR TICKETS</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
              }}
            >
              <Typography variant='h6' style={{ color: 'white', WebkitTextStroke: '2px black', fontSize: '20px' }}>total TICKETS</Typography>
              <Typography variant='h6' style={{ color: 'white', WebkitTextStroke: '2px black', fontSize: '20px' }}>{tickets.length}</Typography>
            </Box>
            
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
              }}
            >
              <Typography variant='h6' style={{ color: 'white', WebkitTextStroke: '2px black', fontSize: '20px' }}>Winning TICKETS</Typography>
              <Typography variant='h6' style={{ color: 'white', WebkitTextStroke: '2px black', fontSize: '20px' }}>
                { winning[1] ? (winning[1].length + winning[2].length + winning[3].length + winning[4].length + winning[5].length + winning[6].length) : 0 }
              </Typography>
            </Box>

            <Box overflow="auto" flex={1} flexDirection="column" display="flex" p={2} style={{ height: '250px' }}>
              {
                tickets.map((elem: any, idx: any) => (
                  <>
                  <Typography variant='h6' style={{ color: 'white', WebkitTextStroke: '2px black', fontSize: '25px' }}>#{elem.ticketNumber}</Typography>
                  <Typography variant='h6' style={{ textAlign: "center", color: 'white', letterSpacing: '25px', }} className='text-dark-green' key={idx}>
                    {renderSeries(elem.series)}
                  </Typography>
                  </>
                ))
              }
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal >
  )
}

export default PastTicketsModal
