import React, { FC, useEffect, useState } from 'react'

import type, { NextPage } from 'next'
import Layout from 'components/Layout'
import Header from 'components/Header'
import Sidebar from 'components/Sidebar'

import { MagicSpinner } from "react-spinners-kit"
import Box from '@mui/material/Box';

const Raffle: NextPage = () => {
  const [loading, setLoading] = useState(false)
  return (
    <>
      {
        loading && <div className="loading-container">
          <MagicSpinner size={170} color="#00ff89" />
        </div>
      }
      <Layout>
        <Box>
          <Header/>
          <Sidebar
            // nextRound={nextRound}
            // tokenPrice={tokenPrice}
            setLoading={setLoading}
          // getPastRound={(number: any) => {
          //   getPastRound(number)
          // }}
          // getNextRound={() => {
          //   getNextRound()
          // }}
          // additionalPrize={additionalPrize}
          // nextTickets={nextTickets}
          // setNextTickets={setNextTickets}
          />
        </Box>
      </Layout>
    </>
  )
}

export default Raffle
