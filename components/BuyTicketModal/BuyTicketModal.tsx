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
  setLoading: any
  nextRound: any
  getNextRound: () => void
  nextTickets: any
  setNextTickets: any
  // handleSelct: (imgSrc: string) => void
  // nftsList: { [key: string]: NFTmap }
  // lockedSamos: any
  // nftType: any
}

const BuyTicketModal: FC<Props> = (props) => {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()

  const {
    open,
    handleClose,
    tickets,
    setLoading,
    nextRound,
    getNextRound,
    nextTickets,
    setNextTickets
    // handleSelct, 
    // nftsList, 
    // lockedSamos, 
    // nftType 
  } = props

  // const samoses: NFTmap[] = Object.values(nftsList)

  // samoses.sort((a: any, b: any) => {
  //   return a.NFT.name.split("#")[1] - b.NFT.name.split("#")[1]
  // })

  const renderPrice = (param: any) => {
    return `${Math.floor(parseFloat(process.env.NEXT_PUBLIC_BONES_PER_TICKET || "0") * param * 100) / 100.0} $BONES`;
  }

  const [ticketCount, setTicketCount] = useState<number>(0);

  const headers = {
    "Access-Control-Allow-Origin": "*"
  }

  const buyTickets = async () => {
    if (!nextRound.number) {
      toast.error("No round now!")
      return
    }

    if (ticketCount == 0) {
      toast.error("Please enter the ticket count")
      return
    }
    if (!process.env.NEXT_PUBLIC_TOKEN_ADDRESS || !process.env.NEXT_PUBLIC_LOCKED_WALLET) return

    if (!publicKey || !signTransaction) {
      throw new WalletNotConnectedError()
      return
    }

    setLoading(true)
    handleClose()

    let signature = null

    try {
      // lock wallet address
      const lockWalletAddr = new PublicKey(process.env.NEXT_PUBLIC_LOCKED_WALLET)

      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(process.env.NEXT_PUBLIC_TOKEN_ADDRESS),
        publicKey,
        signTransaction
      )
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(process.env.NEXT_PUBLIC_TOKEN_ADDRESS),
        lockWalletAddr,
        signTransaction
      )

      const transaction = new Transaction().add(
        createTransferInstruction( // send the $core
          fromTokenAccount.address, // source
          toTokenAccount.address, // dest
          publicKey,
          100 * parseFloat(process.env.NEXT_PUBLIC_BONES_PER_TICKET || "0") * ticketCount,
          [],
          TOKEN_PROGRAM_ID
        )
      )

      const blockHash = await connection.getRecentBlockhash()
      transaction.feePayer = publicKey
      transaction.recentBlockhash = blockHash.blockhash

      const signed = await signTransaction(transaction)

      signature = await connection.sendRawTransaction(signed.serialize())

      await connection.confirmTransaction(signature)
    } catch (error) {
      toast.error("Something went wrong!")
    }

    console.log(signature)
    if (signature) { // check the signature
      // try {
      //   const res = await axios.get(`https://public-api.solscan.io/transaction/${signature}`, {
      //     method: "GET",
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   })

      //   console.log(res)
      //   if (res.status == 200) {
      //     const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/buy_tickets`, {
      //       walletAddress: publicKey.toString(),
      //       ticketCount
      //     }, { headers })

      //     if (data.success) {
      //       for (let i = 0; i < data.tickets.length; i++) {
      //         const element = data.tickets[i];

      //         tickets.push(element)
      //       }
      //       // const buf = available.filter((elem: any) => {
      //       //   return elem.nftAddress != data.radar.nftAddress
      //       // })
      //       // setAvailable(buf)
      //       toast.success("You bought the tickets!")
      //     } else {
      //       toast.error(`${data.msg}`)
      //     }
      //   }
      // } catch (error) {
      //   console.log(error)
      //   toast.error("Something went wrong!")
      // }

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/buy_tickets`, {
        walletAddress: publicKey.toString(),
        ticketCount
      }, { headers })

      
      if (data.success) {
        let tmpTickets = []
        for (let i = 0; i < data.tickets.length; i++) {
          const element = data.tickets[i];

          tickets.push(element)
          tmpTickets.push(element)
        }

        setNextTickets(tmpTickets)

        getNextRound()
        toast.success("You bought the tickets!")
      } else {
        toast.error(`${data.msg}`)
      }
    } else {
      toast.error("Something went wrong!")
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
            BUY TICKETS
          </Typography>
          <IconButton className="closeBtn" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' className='text-dark-green' style={{ fontSize: '25px' }}>BUY:</Typography>
              <LazyLoadImage src="BONES_Logo 1.png" width="40px" />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }} style={{ background: '#C4C4C4', borderRadius: '20px' }}>
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
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 3 }}>
              <Typography variant='h6' className='text-dark-green' style={{ fontSize: '25px' }}>COST (BONES)</Typography>
              <Typography variant='h6' className='text-dark-green' style={{ fontSize: '25px' }}>{renderPrice(ticketCount)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 3 }}>
              <Typography variant='h6' className='text-dark-green' style={{ fontSize: '30px' }}>YOU PAY</Typography>
              <Typography variant='h6' className='text-dark-green' style={{ fontSize: '30px' }}>{renderPrice(ticketCount)}</Typography>
            </Box>
            <Box display="flex"
              justifyContent="center"
              flexDirection='column'
              alignItems="center">
              <Button style={{
                background: '#3B6253',
                color: 'white',
                borderRadius: '27px',
                fontSize: '30px',
              }} sx={{ my: 2, px: 2 }} onClick={() => {
                buyTickets()
              }}>
                BUY INSTANTLY
              </Button>
              <Button style={{
                background: '#FF9A5D',
                color: 'white',
                borderRadius: '27px',
                fontSize: '30px',
              }} sx={{ my: 2, px: 2 }}>
                Buy $Bones
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default BuyTicketModal
