import React, { FC } from 'react'
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import styles from 'styles/components/MoreAbout.module.css'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid #fff`,
  backgroundColor: 'rgba(255, 255, 255, 0.16)',
  backdropFilter: 'blur(104px)',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:first-of-type': {
    borderTopLeftRadius: '14px',
    borderTopRightRadius: '14px'
  },
  '&:last-child': {
    borderBottomLeftRadius: '14px',
    borderBottomRightRadius: '14px'
  },
  '&:before': {
    display: 'none',
  }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    // expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    expandIcon={
      <Button variant="contained">
      </Button>}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  padding: '25px 50px',
  '& .MuiTypography-root': {
    color: 'white',
    fontSize: '18px',
    fontFamily: 'Luckiest Guy',
    fontWeight: '400',
    letterSpacing: '0.05em',
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'none !important',
    '& .MuiButton-root': {
      backgroundColor: '#282C3C'
    }
  },
  '& .MuiAccordionSummary-content': {
    margin: '0'
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    position: 'absolute',
    right: '50px',
    '& .MuiButton-root': {
      width: '25px',
      height: '25px',
      minWidth: 'unset',
      padding: '0',
      boxShadow: 'none',
      backgroundColor: '#249FDE',
      '& span:nth-of-type(2)': {
        display: 'none'
      }
    }
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: '0 50px 25px',
  '& .MuiTypography-root': {
    color: 'white',
    fontSize: '18px',
    fontFamily: 'Red Hat Display'
  }
}));

const MoreAbout: FC = () => {

  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Box className={styles.moreAbout + " " + "s-section"}>
      <Typography variant="h3" className="section-title">
        MORE ABOUT Iguanas
      </Typography>
      <Box className={styles.contents + " " + "about-collapse"}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>What Is Your Goal/Mission?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Our mission is to build a strong and unique community. Join our mission and create history!
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography>How Many NFTs Available?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              1111 Total
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <Typography>Mint Price</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Price of mint is 0.05 SOL for the first 555 mints and 0.15 SOL for the remaining 555 Mints.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
          <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
            <Typography>Wen Mint?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Mint Link will be dropped on Twitter (Stealth Launch)
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
          <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
            <Typography>Wen and Where Listing?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We aim to be listed on the major Solana marketplaces after selling out (we will contact them after mint)
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
          <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
            <Typography>What are the Secondary Market Royalties</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We have set royalties to 10%, where 69% of royalties go back to the community in forms of giveaways and much more!
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  )
}

export default MoreAbout
