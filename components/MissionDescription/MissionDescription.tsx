import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import FooterText from 'components/FooterText'
import EvolutionType from 'components/EvolutionType'

import ClearIcon from '@mui/icons-material/Clear';

interface Props {
  leftEggs: any,
}

const ChooseTypeEvolution: FC<Props> = (props) => {
  const { leftEggs } = props

  return (
    <Grid container spacing={2} sx={{px:2}}>
      <Grid item md={8} sm={6} xs={12}>
        <Box className='choose-type-section-wrapper' style={{minHeight: '210px'}} sx={{px:3}}>
          <Box style={{textAlign: 'center'}}>
            <Typography variant='h6' style={{ color: '#7f7a71' }} sx={{ m:1 }}>
              LAUNCH INTO COSMIC SPACE IN SEARCH FOR EGGS
            </Typography>
          </Box>
          
          <Typography variant='subtitle2' style={{ color: '#7f7a71' }} sx={{py:0.5}}>
            - EACH MISSION COSTS {parseFloat(process.env.NEXT_PUBLIC_CORE_FOR_RADAR || "0")} SCORE AND HAS A 10% CHANCE OF RETRIEVING AN EGG.
          </Typography>
          <Typography variant='subtitle2' style={{ color: '#7f7a71' }} sx={{py:0.5}}>
            - BURN RADARS TO INCREASE THE CHANCE OF FINDING AN EGG.
          </Typography>
          <Typography variant='subtitle2' style={{ color: '#7f7a71' }} sx={{py:0.5}}>
            - EACH IGUANA HAS A 3 DAY LOCK AFTER A MISSION ATTEMPT.
          </Typography>
        </Box>
      </Grid>

      <Grid item md={4} sm={6} xs={12}>
        <Box className='choose-type-section-wrapper' style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>          
          <Typography variant='subtitle2' style={{ color: '#7f7a71' }}>EGGS LEFT</Typography>

          <Typography variant='subtitle1' style={{ color: '#7f7a71' }} sx={{ m:1 }}>{leftEggs.alpha}</Typography>

          <Typography variant='subtitle2' style={{ color: '#7f7a71' }}>OUT OF 1111 TOTAL</Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default ChooseTypeEvolution
