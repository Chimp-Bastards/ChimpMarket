import React, { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import type, { NextPage } from 'next'
import Layout from 'components/Layout'
import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import Body from 'components/Body'
import PickModal from 'components/PickModal'

import { Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';

import { ToastContainer, toast, Zoom } from 'react-toastify';

import { Samo } from 'types/typings'

import { LazyLoadImage } from 'react-lazy-load-image-component'

import { MagicSpinner } from "react-spinners-kit"

import useFetchAllNfts from "hooks/useFetchAllNfts"
import * as anchor from "@project-serum/anchor"

import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { Transaction, PublicKey, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'

import { getOrCreateAssociatedTokenAccount } from 'utills/getOrCreateAssociatedTokenAccount'
import { createTransferInstruction } from 'utills/createTransferInstructions'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

import axios from "axios"

const AuctionCreate: NextPage = () => {
  const { publicKey, signTransaction } = useWallet()
  const connection = new anchor.web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)

  const router = useRouter();

  const [loading, setLoading] = useState(false)
  const [openPickModal, setOpenPickModal] = useState(false)

  const [samo, setSamo] = useState<Samo>()

  const { nftsList, mintAddrList } = useFetchAllNfts(setLoading)
  const [price, setPrice] = useState<number>(1);

  const headers = {
    "Access-Control-Allow-Origin": "*"
  }

  const createAuction = async () => {
    if (!process.env.NEXT_PUBLIC_TOKEN_ADDRESS || !process.env.NEXT_PUBLIC_LOCKED_WALLET) return

    console.log(samo)

    if (!samo || !samo?.address) {
      toast.error("Please select nft!")
      return
    }

    if (!price || price == 0) {
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

      const fromNFTAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(samo.address),
        publicKey,
        signTransaction
      )
      const toNFTAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(samo.address),
        lockWalletAddr,
        signTransaction
      )

      const transaction = new Transaction().add(
        createTransferInstruction( // send nft
          fromNFTAccount.address, // source
          toNFTAccount.address, // dest
          publicKey,
          1,
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

    console.log(signature)

    if (signature) {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/create_auction`, {
        walletAddress: publicKey.toString(),
        nftAddress: samo.address,
        nftName: samo.name,
        nftImage: samo.imageURL,
        price,
      }, { headers })

      if (data.success) {
        toast.success("New Auction created")
      } else {
        toast.error(`something went wrong`)
      }

      router.push('/auctions')
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
        <Header />
        <Container>
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <Box style={{ maxWidth: '300px', margin: 'auto', border: '5px dotted' }} onClick={() => {
                setOpenPickModal(true)
              }}>
                {
                  (samo?.address && nftsList[samo.address]?.NFT?.image) ? (
                    <LazyLoadImage src={nftsList[samo.address]?.NFT?.image} alt="Samos" width="100%" />
                  ) : (
                    <LazyLoadImage src="/add.png" width="100%" />
                  )
                }
              </Box>

              <Box sx={{ py: 3 }} style={{ maxWidth: '300px', margin: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">Price (LUX)</Typography>
                  <Input type="number" placeholder="price" value={price} onChange={(e) => {
                    var value = parseInt(e.target.value, 10);
                    if (value < 1) e.target.value = '1';

                    setPrice(parseInt(e.target.value, 10));
                  }} style={{ backgroundColor: 'white' }} />
                </Box>
                <Box sx={{ py: 3 }}>
                  <Button variant='contained' onClick={() => {
                    createAuction()
                  }}>
                    Create
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Layout>
      <PickModal
        open={openPickModal}
        handleSelect={(mint: string, name: string, imageURL: string) => {
          setSamo({ ...samo, ["address"]: mint, ['name']: name, ['imageURL']: imageURL })
          setOpenPickModal(false)
        }}
        handleClose={() => setOpenPickModal(false)}
        nftsList={nftsList}
      // lockedSamos={lockedSamos}
      // nftType={selectedId}
      />
    </>
  )
}

export default AuctionCreate
