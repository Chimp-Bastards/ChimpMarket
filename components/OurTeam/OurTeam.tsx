import React, { FC } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import TeamMember from './TeamMember'

const OurTeam: FC = () => {

  const members = [
    {
      title: 'Hype',
      job: 'Co-founder',
      src: '/member-1.png'
    },
    {
      title: 'Paladin',
      job: 'Co-founder',
      src: '/member-2.png'
    },
    {
      title: 'Minato',
      job: 'Developer',
      src: '/member-3.png'
    },
    {
      title: 'Akiro',
      job: 'Artist',
      src: '/member-4.png'
    }
  ]

  return (
    <Box className={"ourTeamSection " + 's-section'}>
      <Typography variant="h3" className="section-title">
        Our Team
      </Typography>
      <Box className={"s-contents"}>
        <Grid container spacing={5}>
          {
            members.map(member => (
              <Grid item xs={12} sm={6} lg={3} key={member.title}>
                <TeamMember
                  title={member.title}
                  job={member.job}
                  src={member.src}
                />
              </Grid>
            ))
          }
          <Grid item xs={12}>
            <Typography variant="body1" className='footerText' align='center'>
              2022 Copyrights © Iguana.<br className="d-none d-md-block" /> All right reserved.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default OurTeam
