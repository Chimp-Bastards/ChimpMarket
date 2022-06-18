import React, { FC } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import Token from './Token'

const Tokenomics: FC = () => {

  const tokens = [
    {
      id: 1,
      value: '24,420,420',
      title: 'SUPPLY'
    },
    {
      id: 2,
      value: '80%',
      title: 'SAMO Holders',
      subTitle: '(In General)'
    },
    {
      id: 3,
      value: '10%',
      title: 'Liquidity'
    },
    {
      id: 4,
      value: '10%',
      title: 'Reserve'
    }
  ]

  return (
    <Box className="token">
      <Typography variant="h3" className="section-title">
        TOKENOMICS
      </Typography>
      <Box className="tokensList">
        <Grid container spacing={5}>
          {
            tokens.map(token => (
              <Grid item xs={6} md={3} key={token.id}>
                <Token
                  title={token.title}
                  value={token.value}
                  subTitle={token.subTitle}
                />
              </Grid>
            ))
          }
        </Grid>
      </Box>
    </Box>
  )
}

export default Tokenomics
