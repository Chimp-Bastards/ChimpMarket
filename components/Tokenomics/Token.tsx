import React, { FC } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  value: string;
  title: string;
  subTitle?: string;
}

const Token: FC<Props> = (props) => {

  const { value, title, subTitle } = props

  return (
    <Box className="tokenItem">
      <Box display="flex" alignItems='center' justifyContent='center' className="valueWrapper">
        <Typography variant="h4" align='center'>
          {value}
        </Typography>
      </Box>     
      <Box display='flex' justifyContent='center' flexDirection='column' className="titleWrapper">
        <Typography variant="h5" align='center'>
          {title}
        </Typography>
        {
          subTitle && (
            <Typography variant="h5" align='center'>
              {subTitle}
            </Typography>
          )
        }
      </Box>
    </Box>
  )
}

export default Token
