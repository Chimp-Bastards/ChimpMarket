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
  // tickets: any
  setLoading: any
  // nextRound: any
  // getNextRound: () => void
  // nextTickets: any
  // setNextTickets: any
  // handleSelct: (imgSrc: string) => void
  // nftsList: { [key: string]: NFTmap }
  // lockedSamos: any
  // nftType: any
}

const CreateRaffleModal: FC<Props> = (props) => {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()

  const {
    open,
    handleClose,
    // tickets,
    setLoading,
    // nextRound,
    // getNextRound,
    // nextTickets,
    // setNextTickets
    // handleSelct, 
    // nftsList, 
    // lockedSamos, 
    // nftType 
  } = props

  // const samoses: NFTmap[] = Object.values(nftsList)

  // samoses.sort((a: any, b: any) => {
  //   return a.NFT.name.split("#")[1] - b.NFT.name.split("#")[1]
  // })

  // const renderPrice = (param: any) => {
  //   return `${Math.floor(parseFloat(process.env.NEXT_PUBLIC_BONES_PER_TICKET || "0") * param * 100) / 100.0} $BONES`;
  // }

  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [maxWinners, setMaxWinners] = useState<number>(1);
  const [period, setPeriod] = useState<number>(1);

  const headers = {
    "Access-Control-Allow-Origin": "*"
  }

  const createRaffle = async () => {
    console.log(imageUrl, period)

    if (imageUrl == "") {
      toast.error("No Image url!")
      return
    }

    if (name == "") {
      toast.error("No Name!")
      return
    }

    if (!maxWinners || maxWinners == 0) {
      toast.error("Please enter the max winners")
      return
    }

    if (!period || period == 0) {
      toast.error("Please enter the period")
      return
    }

    if (!publicKey || !signTransaction) {
      throw new WalletNotConnectedError()
      return
    }

    setLoading(true)
    handleClose()

    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/create_raffle`, {
      walletAddress: publicKey.toString(),
      imageUrl,
      name,
      maxWinners,
      period,
    }, { headers })

    if (data.success) {
      toast.success("You create raffle")
    } else {
      toast.error(`something went wrong`)
    }

    setLoading(false)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="pick-modal-body">
        <Box className="modalContent">
          <Typography variant="h5" className="modalTitle" style={{ fontSize: '35px' }}>
            Create raffle
          </Typography>
          <IconButton className="closeBtn" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                Image URL
                <Input placeholder="Image URL" value={imageUrl} onChange={(e) => {
                  setImageUrl(e.target.value)
                }} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                Name
                <Input placeholder="Raffle Name" value={name} onChange={(e) => {
                  setName(e.target.value)
                }} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                Max Winners
                <Input type="number" placeholder="Max Winners" value={maxWinners} onChange={(e) => {
                  var value = parseInt(e.target.value, 10);

                  if (value > 100) e.target.value = '100';
                  if (value < 1) e.target.value = '1';

                  setMaxWinners(parseInt(e.target.value, 10));
                }} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                Period(hours)
                <Input type="number" placeholder="raffle period" value={period} onChange={(e) => {
                  var value = parseInt(e.target.value, 10);

                  if (value > 10) e.target.value = '10';
                  if (value < 1) e.target.value = '1';

                  setPeriod(parseInt(e.target.value, 10));
                }} />
              </Box>
            </Box>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' className='text-dark-green' style={{ fontSize: '25px' }}>BUY:</Typography>
              <LazyLoadImage src="BONES_Logo 1.png" width="40px" />
            </Box> */}

            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }} style={{ background: '#C4C4C4', borderRadius: '20px' }}>
              <Box>
                <Input type="number" className='input-tickets' onChange={(e) => {
                  var value = parseInt(e.target.value, 10);

                  if (value > 100) e.target.value = '100';
                  if (value < 1) e.target.value = '1';

                  setTicketCount(parseInt(e.target.value, 10));
                }} />

                <Typography style={{
                  fontFamily: 'Luckiest Guy',
                  fontStyle: 'normal',
                  fontSize: '18px',
                  color: '#FFF9F0',
                  textAlign: 'right',
                  paddingRight: '15px',
                }}>{renderPrice(ticketCount)}</Typography>
              </Box>
            </Box> */}

            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 3 }}>
              <Typography variant='h6' className='text-dark-green' style={{ fontSize: '25px' }}>COST (BONES)</Typography>
              <Typography variant='h6' className='text-dark-green' style={{ fontSize: '25px' }}>{renderPrice(ticketCount)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 3 }}>
              <Typography variant='h6' className='text-dark-green' style={{ fontSize: '30px' }}>YOU PAY</Typography>
              <Typography variant='h6' className='text-dark-green' style={{ fontSize: '30px' }}>{renderPrice(ticketCount)}</Typography>
            </Box> */}
            <Box display="flex"
              justifyContent="center"
              flexDirection='column'
              alignItems="center">
              <Button style={{
                background: '#3B6253',
                color: 'white',
                borderRadius: '27px',
                // fontSize: '30px',
              }} sx={{ my: 2, px: 2 }} onClick={() => {
                createRaffle()
              }}>
                Create
              </Button>
              {/* <Button style={{
                background: '#FF9A5D',
                color: 'white',
                borderRadius: '27px',
                fontSize: '30px',
              }} sx={{ my: 2, px: 2 }}>
                Buy $Bones
              </Button> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default CreateRaffleModal
