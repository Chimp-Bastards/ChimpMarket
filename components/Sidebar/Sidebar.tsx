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

import {
  useAnchorWallet, useConnection, useWallet,
} from "@solana/wallet-adapter-react";

import { Container } from '@mui/material'

import { useEffect, useState } from "react";
import { makeStyles } from '@mui/styles';
import clsx from 'clsx'
import axios from "axios"

import CreateRaffleModal from 'components/CreateRaffleModal';
import RaffleCard from 'components/RaffleCard'

interface Props {
  // nextRound: any
  // tokenPrice: any
  setLoading: any
  // getPastRound: (number: any) => void
  // getNextRound: () => void
  // additionalPrize: any
  // nextTickets: any
  // setNextTickets: any
}

const Sidebar: FC<Props> = (props) => {
  const [isAdmin, setIsAdmin] = useState(false)

  const {
    // nextRound, tokenPrice, 
    setLoading,
    // getPastRound, getNextRound, additionalPrize, nextTickets, setNextTickets 
  } = props

  const { publicKey, signTransaction } = useWallet()
  const [createRaffleModal, setCreateRaffleModal] = useState(false)
  // const [openMenuModal, setOpenMenuModal] = useState(false)
  // const [tickets, setTickets] = useState<any>([])

  const [raffles, setRaffles] = useState<any>([])

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

  // const [timer, setTimer] = useState(1)

  // const [balances, setBalances] = useState({ solBalance: 0, boneBalance: 0 });
  // const connection = new anchor.web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)

  // const [expanded, setExpanded] = useState<string | false>(false);

  // const handleMenuChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
  //   setExpanded(isExpanded ? panel : false);
  // };
  useEffect(() => {
    const getAllRaffles = async () => {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-raffles`, {
      }, { headers })

      if (data.raffles) {
        setRaffles(data.raffles)
      }
    }

    getAllRaffles()
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Box className='sidebar-wrapper'>
        <Container >
          {
            isAdmin && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button variant="contained" onClick={() => {
                    setCreateRaffleModal(true)
                  }}>Create</Button>
                </Box>
              </>
            )
          }

          <Grid container spacing={5}>
            {
              raffles.map((elem: any, idx: any) => (
                <Grid item xs={6} sm={3} md={3} key={idx}>
                  <RaffleCard
                    raffle={elem}
                  />
                </Grid>
              ))
            }
          </Grid>
        </Container>
      </Box>

      <CreateRaffleModal
        open={createRaffleModal}
        handleClose={() => setCreateRaffleModal(false)}
        // tickets={tickets}
        setLoading={setLoading}
      // nextRound={nextRound}
      // getNextRound={() => {
      //   getNextRound()
      // }}
      // nextTickets={nextTickets}
      // setNextTickets={setNextTickets}
      />
    </>
  )
}

export default Sidebar

