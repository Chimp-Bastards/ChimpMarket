import React, { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Container } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import { LazyLoadImage } from 'react-lazy-load-image-component'

import { useAnchorWallet, useWallet, } from "@solana/wallet-adapter-react";
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui"
import axios from "axios"

const Body: FC<{}> = () => {
  const [isAdmin, setIsAdmin] = useState(false)

  const { publicKey, signTransaction } = useWallet()

  const router = useRouter();
  const [auctions, setAuctions] = useState<any>([])

  const headers = {
    "Access-Control-Allow-Origin": "*"
  }

  useEffect(() => {
    const getAdmins = async () => {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/get-admins`, {}, { headers })

      if (data?.admins.findIndex((elem: any) => elem == publicKey?.toString()) != -1) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    }

    getAdmins()
  }, [publicKey]);

  useEffect(() => {
    const getAllRaffles = async () => {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-auctions`, {
      }, { headers })

      if (data.auctions) {
        setAuctions(data.auctions)
      }
    }

    getAllRaffles()
  }, []);

  return (
    <Box className="body-wrapper">
      <Container>
        {
          isAdmin && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" onClick={() => router.push('auctions/create')}>Create</Button>
              </Box>
            </>
          )
        }

        <Grid container>
          {
            auctions.map((elem: any, idx: any) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Box style={{ position: 'relative' }}>
                  <Box style={{ position: "absolute", width: "320px", top: '0px' }}>
                    <Box sx={{ px: 3 }}>
                      <LazyLoadImage src={elem.auction[0].nftImage} width="100%" style={{ backgroundColor: 'black' }} />
                    </Box>
                    <Box sx={{ px: 3 }}>
                      <Typography variant='h6' style={{ textAlign: 'center', color: 'white', WebkitTextStroke: '2px black' }}>{elem.auction[0].nftName}</Typography>
                    </Box>

                    {
                      elem.auction[0].isEnd ? (
                        <>
                          <Box>
                            <Typography variant='subtitle1' style={{ textAlign: 'center' }}>Winning Bid:</Typography>
                            <Typography variant='h6' style={{ textAlign: 'center' }}>{elem.bidders.find((elem: any) => elem.isWinner == true)?.bidPrice} $LUX</Typography>
                          </Box>
                          <Box>
                            <Typography variant='subtitle1' style={{ textAlign: 'center' }}>Auction closed!</Typography>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box sx={{ py: 2 }}>
                            <Typography variant='subtitle1' style={{ textAlign: 'center' }}>Price:</Typography>
                            <Typography variant='h6' style={{ textAlign: 'center' }}>{elem.auction[0].price} $LUX</Typography>
                          </Box>
                          <Box sx={{ py: 2 }}>
                            <Typography variant='subtitle1' style={{ textAlign: 'center' }}>Bids: {elem.bidders.length}</Typography>
                          </Box>
                        </>
                      )
                    }
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      {
                        elem.auction[0].isEnd ? (
                          <Button variant="contained" onClick={() => router.push('auctions/' + elem.auction[0]._id)}>View Winners</Button>
                        ) : (
                          publicKey && (
                            elem.auction[0].userWallet != publicKey?.toString() ? (
                              <Button variant="contained" onClick={() => router.push('auctions/' + elem.auction[0]._id)}>Bid</Button>
                            ) : (
                              <Button variant="contained" onClick={() => router.push('auctions/' + elem.auction[0]._id)}>View</Button>
                            )
                          )
                        )
                      }
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))
          }
        </Grid>
      </Container>
    </Box>
  )
}

export default Body
