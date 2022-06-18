import type, { NextPage } from 'next'
import { useRouter } from 'next/router'

import Layout from 'components/Layout'
import Header from 'components/Header'
import Sidebar from 'components/Sidebar'

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

const AuctionDetail: NextPage = () => {
  const { publicKey, signTransaction } = useWallet()
  const connection = new anchor.web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)

  const router = useRouter();

  const { query } = useRouter()
  const auctionId = query['id']
  const [auction, setAuction] = useState<any>()
  const [bidders, setBidders] = useState<any>([])
  const [bidPrice, setBidPrice] = useState<number>(1);

  const [loading, setLoading] = useState(false)

  console.log(auctionId)

  const headers = {
    "Access-Control-Allow-Origin": "*"
  }

  useEffect(() => {
    const getAuction = async () => {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction-detail`, {
        auctionId
      }, { headers })

      setAuction(data.auction)
      setBidders(data.bidders)
    }

    getAuction()
    // eslint-disable-next-line
  }, []);

  const truncate = (input: string) => {
    if (!input) {
      return ''
    }

    if (input.length > 5) {
      return input.substring(0, 5) + '...';
    }
    return input;
  };

  const bid = async () => {
    if (!process.env.NEXT_PUBLIC_TOKEN_ADDRESS || !process.env.NEXT_PUBLIC_LOCKED_WALLET) return

    if (!bidPrice || bidPrice == 0) {
      toast.error("Please enter the price")
      return
    }

    if (!publicKey || !signTransaction) {
      throw new WalletNotConnectedError()
      return
    }
    setLoading(true)

    let signature = null
    try {
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
        createTransferInstruction( // send the token
          fromTokenAccount.address, // source
          toTokenAccount.address, // dest
          publicKey,
          1000000000 * bidPrice,
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

    }

    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auction-bid`, {
      walletAddress: publicKey.toString(),
      auctionId,
      bidPrice,
    }, { headers })

    if (data.success) {
      toast.success("You bidded!")
      router.push('/auctions')
    } else {
      toast.error(`error when you bid`)
    }
    setLoading(false)
  }

  const acceptBid = async (bidder: string) => {
    if (!process.env.NEXT_PUBLIC_TOKEN_ADDRESS || !process.env.NEXT_PUBLIC_LOCKED_WALLET) return

    if (!publicKey || !signTransaction) {
      throw new WalletNotConnectedError()
      return
    }

    setLoading(true)
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/accept-bid`, {
      walletAddress: publicKey.toString(),
      auctionId,
      bidder
    }, { headers })

    if (data.success) {
      toast.success("You accept!")
      router.push('/auctions')
    } else {
      toast.error(`error when you accept`)
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
        <Header />
        <Container>
          <Box>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={4} md={4}>
                <Box sx={{ p: 2 }}>
                  <LazyLoadImage src={auction?.nftImage} width="100%" style={{ backgroundColor: 'black' }} />
                  <Box sx={{ p: 2 }}>
                    <Typography variant='h5'>Description</Typography>
                    <Typography variant='subtitle2' style={{ lineHeight: '100%' }}>The winner will receive a custom 3D printed of their chosen DeGod or DeadGod.</Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography variant='h5'>How to cancel my bid?</Typography>
                    <Typography variant='subtitle2' style={{ lineHeight: '100%' }}>Every non-winning bid will be refunded after the auction has ended. However, you can cancel your bid at any time but you will be charged 0.033 SOL (PHBT).</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <Box sx={{ p: 2 }}>
                  <Typography variant='h5'>{auction?.nftName}</Typography>
                  <Box sx={{ p: 4, my: 2 }} style={{ backgroundColor: '#7772', color: 'white' }}>
                    {
                      auction?.isEnd ? (
                        <>
                          <Typography variant='h5' style={{ textAlign: 'center' }}>Auction closed!</Typography>
                          <Typography variant='h5' style={{ textAlign: 'center' }}>Congrats to the winner</Typography>
                          <Typography variant='h5' style={{ textAlign: 'center' }}>{truncate(bidders.find((elem: any) => elem.isWinner == true)?.userWallet)} won for {bidders.find((elem: any) => elem.isWinner == true)?.bidPrice} $LUX</Typography>
                        </>
                      ) : (
                        auction?.userWallet != publicKey?.toString() && (
                          bidders.findIndex((elem: any) => elem.userWallet == publicKey?.toString()) >= 0 ? (
                            <>
                              <Typography variant='h5' style={{ textAlign: 'center' }}>You already made a bid!</Typography>
                            </>
                          ) : (
                            <>
                              <Input type="number" placeholder="bid price" value={bidPrice} onChange={(e) => {
                                var value = parseInt(e.target.value, 10);

                                if (value < 1) e.target.value = '1';

                                setBidPrice(parseInt(e.target.value, 10));
                              }} />
                              <Button variant="contained" onClick={() => {
                                bid()
                              }}>Bid</Button>
                            </>
                          )
                        )
                      )
                    }
                  </Box>

                  <Box sx={{ p: 4, my: 2 }} style={{ backgroundColor: '#7772' }}>
                    <Typography variant='h5'>Bid History</Typography>
                    {
                      bidders.map((elem: any) => (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                          <Typography variant='subtitle1'>{truncate(elem.userWallet)}</Typography>
                          <Typography variant='subtitle1'>{elem.createdAt}</Typography>
                          <Typography variant='subtitle1'>{elem.bidPrice} $LUX</Typography>
                          {
                            !auction?.isEnd && (
                              auction?.userWallet == publicKey?.toString() && (
                                <Button variant="contained" onClick={() => {
                                  acceptBid(elem.userWallet)
                                }}>Accept</Button>
                              )
                            )
                          }
                        </Box>
                      ))
                    }
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Layout>
    </>
  )
}

export default AuctionDetail
