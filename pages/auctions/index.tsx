import React, { FC, useEffect, useState } from 'react'

import type, { NextPage } from 'next'
import Layout from 'components/Layout'
import Header from 'components/Header'
import Body from 'components/Body'

import { MagicSpinner } from "react-spinners-kit"
import Box from '@mui/material/Box';

const Auction: NextPage = () => {
  const [loading, setLoading] = useState(false)
  return (
    <>
      {
        loading && <div className="loading-container">
          <MagicSpinner size={170} color="#00ff89" />
        </div>
      }
      <Layout>
        <Header/>
        <Body />
      </Layout>
    </>
  )
}

export default Auction
