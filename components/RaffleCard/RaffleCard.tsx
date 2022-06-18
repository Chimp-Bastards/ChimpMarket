import React, { FC } from 'react'
import { useRouter } from 'next/router'

import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link';

interface Props {
  raffle: any
}

const RaffleCard: FC<Props> = (props) => {
  const router = useRouter();
  const { raffle } = props
  const [timer, setTimer] = useState(1)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer + 1)

      const diff = (Date.parse(raffle.raffles[0].endAt) - Date.parse(new Date().toString())) / 1000
      if (diff <= 0) {
        setCooldown(0)
      } else {
        setCooldown((Date.parse(raffle.raffles[0].endAt) - Date.parse(new Date().toString())) / 1000)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  return (
    <Box sx={{ p: 5 }}>
      <Box sx={{ p: 2 }}>
        <LazyLoadImage src={raffle.raffles[0].imageUrl} width="100%" />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h6' style={{ color: 'white', WebkitTextStroke: '2px black', fontSize: '25px' }}>{raffle.raffles[0].name}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant='subtitle1'>{raffle.tickets.length} sold</Typography>
        <Typography variant='subtitle1'>{raffle.raffles[0].maxWinners} winner(s)</Typography>
      </Box>
      {
        !raffle.raffles[0].isEnd && (
          <Box>
            <Typography>Ends in: {Math.floor(cooldown / (3600 * 24))}d {Math.floor(cooldown % (3600 * 24) / 3600)}h {Math.floor(cooldown % 3600 / 60)}m {Math.floor(cooldown % 60)}s</Typography>
          </Box>
        )
      }
      <Box>
        {
          !raffle.raffles[0].isEnd ? (
            <>
              <Button variant="contained" onClick={() => router.push('raffles/' + raffle.raffles[0]._id)}>Join Raffle</Button>
            </>
          ) : (
            <>
              <Button variant="contained" onClick={() => router.push('raffles/' + raffle.raffles[0]._id)}>View Winners</Button>
            </>
          )
        }
      </Box>
    </Box>
  )
}

export default RaffleCard
