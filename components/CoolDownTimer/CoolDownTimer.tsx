import React, { FC, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface Props {
  cooldown: number
}

const CoolDownTimer: FC<Props> = (props) => {
  const { cooldown } = props

  return (
    <Box className="cooldown-date">
      <Typography variant='body1'>
        {Math.floor(cooldown / (3600 * 24))}d {Math.floor(cooldown % (3600 * 24) / 3600)}h {Math.floor(cooldown % 3600 / 60)}m {Math.floor(cooldown % 60)}s
      </Typography>
    </Box>
  )
}

export default CoolDownTimer
