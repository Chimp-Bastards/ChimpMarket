import React, { FC } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// import styles from 'styles/components/OutTeam.module.css'

interface Props {
  src?: string;
  title?: string;
  job?: string;
}

const TeamMember: FC<Props> = (props) => {

  const { src, title, job } = props

  return (
    <Box className="member">
      <img src={src} alt={title} />
      <Typography variant="h3" align='center'>
        {title}
      </Typography>
      <Typography variant="body1" align='center'>
        {job}
      </Typography>
    </Box>
  )
}

export default TeamMember
