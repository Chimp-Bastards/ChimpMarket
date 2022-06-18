import React, { FC, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import FooterText from 'components/FooterText'
import CoolDownTimer from 'components/CoolDownTimer'

interface Props {
  lockedNFTs: any[]
  withdrawEgg: (nftAddress: string) => void
}

const CoolDownSection: FC<Props> = (props) => {
  const { lockedNFTs, withdrawEgg } = props

  return (
    <Box className="cooldown-section-wrapper" sx={{ m: 2, p: '2rem' }}>
      <Typography variant='h6' style={{
        color: '#7f7a71'
      }}>
        YOUR EGGS
      </Typography>
      <Typography variant='subtitle1' style={{
        color: '#7f7a71'
      }}>
        WHAT WILL YOU HATCH?
      </Typography>
      <Grid container spacing={3}>
        {
          lockedNFTs.map((nft, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box className="cooldown-item">
                <Typography variant='body1' style={{ textAlign: "center" }}>
                  {nft.nftName}
                </Typography>
                <Box className="cooldown-card">
                  <LazyLoadImage src={nft.nftImage} alt={nft.nftName} width="100%" height="100%" effect="blur" />
                </Box>
                {
                  nft.cooldown > 0 ?
                    <CoolDownTimer
                      cooldown={nft.cooldown}
                    />
                    :
                    <Button className={'addBtn'} style={{backgroundColor: '#332f3e',}} onClick={() => {
                      withdrawEgg(nft.nftAddress)
                    }}>
                      Add to wallet
                    </Button>
                }
              </Box>
            </Grid>
          ))
        }
      </Grid>
      {/* <FooterText /> */}
    </Box>
  )
}

export default CoolDownSection
