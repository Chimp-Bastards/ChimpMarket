import type, { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import { useEffect, useState } from "react";
import axios from "axios"
import { Button, Container, Typography } from '@mui/material';

import { ToastContainer, toast, Zoom } from 'react-toastify'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { useWallet, useConnection } from "@solana/wallet-adapter-react"

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Input from '@mui/material/Input';

import { Transaction, PublicKey, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount } from 'utills/getOrCreateAssociatedTokenAccount'
import { createTransferInstruction } from 'utills/createTransferInstructions'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

import { MagicSpinner } from "react-spinners-kit"

import * as anchor from "@project-serum/anchor"

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const RaffleDetail: NextPage = () => {
  const { query } = useRouter()
  const raffleId = query['id']

  const [timer, setTimer] = useState(1)
  const [cooldown, setCooldown] = useState(0)
  const [raffle, setRaffle] = useState<any>()
  const [ticketCount, setTicketCount] = useState<number>(1);

  const [winners, setWinners] = useState<any>([]);

  const { publicKey, signTransaction } = useWallet()
  const [loading, setLoading] = useState(false)

  const connection = new anchor.web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer + 1)

      if (raffle) {
        const diff = (Date.parse(raffle.endAt) - Date.parse(new Date().toString())) / 1000
        if (diff <= 0) {
          setCooldown(0)
        } else {
          setCooldown((Date.parse(raffle.endAt) - Date.parse(new Date().toString())) / 1000)
        }
      } else {
        setCooldown(0)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const headers = {
    "Access-Control-Allow-Origin": "*"
  }

  useEffect(() => {
    const getRaffle = async () => {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/raffle-detail`, {
        raffleId
      }, { headers })

      if (data.raffle.isEnd && data.raffle.winners) {
        setWinners(JSON.parse(data.raffle.winners))
      }
      setRaffle(data.raffle)
    }

    getRaffle()
    // eslint-disable-next-line
  }, []);

  const buyTickets = async () => {
    if (!ticketCount || ticketCount == 0) {
      toast.error("Please enter the ticket count")
      return
    }
    if (!process.env.NEXT_PUBLIC_TOKEN_ADDRESS || !process.env.NEXT_PUBLIC_LOCKED_WALLET) return

    if (!publicKey || !signTransaction) {
      throw new WalletNotConnectedError()
      return
    }

    setLoading(true)

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
        raffleId,
        ticketCount,
      }, { headers })

      if (data.success) {
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
    <>
      {
        loading && <div className="loading-container">
          <MagicSpinner size={170} color="#00ff89" />
        </div>
      }
      <Layout>
        <Container>
          <Box>
            {
              raffle && (
                !raffle.isEnd ? (
                  <>
                    <Box style={{ width: '50%', margin: 'auto' }}>
                      <Typography variant="h5">{raffle.name}</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <LazyLoadImage src={raffle.imageUrl} width="100%" />
                        </Grid>
                        <Grid item xs={7}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Typography variant='h6'>Whitelist Spots</Typography>
                            <Typography variant='subtitle1'>{raffle.maxWinners}</Typography>
                          </Box>
                          <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <Typography variant='h6'>Price</Typography>
                              <Typography variant='subtitle1'>{process.env.NEXT_PUBLIC_BONES_PER_TICKET} $Bone/ticket</Typography>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <Typography variant='h6'>Raffle Ends</Typography>
                              <Typography variant='subtitle1'>
                                {Math.floor(cooldown / (3600 * 24))}d {Math.floor(cooldown % (3600 * 24) / 3600)}h {Math.floor(cooldown % 3600 / 60)}m {Math.floor(cooldown % 60)}s
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                            <Input type="number" value={ticketCount} onChange={(e) => {
                              var value = parseInt(e.target.value, 10);

                              if (value > 100) e.target.value = '100';
                              if (value < 1) e.target.value = '1';

                              setTicketCount(parseInt(e.target.value, 10));
                            }} />
                            <Button variant="contained" onClick={() => {
                              buyTickets()
                            }}>Buy {ticketCount} ticket(s)</Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box style={{ width: '50%', margin: 'auto' }}>
                      <Box style={{ width: '30%', margin: 'auto', textAlign: 'center' }}>
                        <LazyLoadImage src={raffle.imageUrl} width="100%" />
                        <Typography variant="h5">{raffle.name} Winners</Typography>
                      </Box>

                      <TableContainer component={Paper} style={{ boxShadow: 'none', backgroundColor: 'rgba(255, 255, 255, 0)', }}>
                        <Table aria-label="collapsible table">
                          <TableHead style={{ backgroundColor: 'none !important' }}>
                            <TableRow>
                              <TableCell style={{ textAlign: 'center' }}>Wallet</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>Entries</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {winners.map((row: any) => (
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell style={{ borderBottom: '0px', textAlign: 'center' }}>{row._id}</TableCell>
                                <TableCell style={{ borderBottom: '0px', textAlign: 'center' }}>{row.count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </>
                )
              )
            }
          </Box>
        </Container>
      </Layout>
    </>
  )
}

export default RaffleDetail
