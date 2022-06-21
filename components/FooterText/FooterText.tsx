import React, { FC, useEffect, useState } from 'react'

import Typography from '@mui/material/Typography';
import { Container } from '@mui/material'
import Box from '@mui/material/Box'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Grid from '@mui/material/Grid'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const FooterText: FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccoChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Box className='footer-wrapper'>
        <Container>
          <Box sx={{ py: 15 }} style={{ textAlign: 'center' }}>
            <Typography className='title' style={{ position: 'relative', display: 'inline' }}>
              HOW IT WORKS
              <LazyLoadImage src="paw1.png" style={{ position: 'absolute', width: '100px', left: '-70px', bottom: '-20px' }} />
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item sm={4} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5, px: 11.2 }} style={{ textAlign: 'center' }}>
                <Typography className='subtitle1'>STEP 1</Typography>
                <Typography className='subtitle2'>Buy Tickets</Typography>
                <Typography className='subtitle2' style={{ fontSize: '20px' }}>Prices are set when the round starts, equal to 5 USD in BONE per ticket.</Typography>
              </Box>
            </Grid>
            <Grid item sm={4} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5, px: 11.2 }} style={{ textAlign: 'center' }}>
                <Typography className='subtitle1'>STEP 2</Typography>
                <Typography className='subtitle2'>Wait for the Draw</Typography>
                <Typography className='subtitle2' style={{ fontSize: '20px' }}>Prices are set when the round starts, equal to 5 USD in BONE per ticket.</Typography>
              </Box>
            </Grid>
            <Grid item sm={4} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5, px: 11.2 }} style={{ textAlign: 'center' }}>
                <Typography className='subtitle1'>STEP 3</Typography>
                <Typography className='subtitle2'>Check for Prizes</Typography>
                <Typography className='subtitle2' style={{ fontSize: '20px' }}>Prices are set when the round starts, equal to 5 USD in BONE per ticket.</Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ py: 15 }} style={{ textAlign: 'center', position: 'relative' }}>
            <LazyLoadImage src="Vector 70.png" width="30%" />
            <Box style={{ marginTop: '-95px' }}>
              <Typography className='criteria-title'>WINNING</Typography>
              <Typography className='criteria-title'>CRITERIA</Typography>
            </Box>
          </Box>

          <Box>
            <Typography className='subtitle2' style={{ fontSize: '20px' }}>The digits on your ticket must match in the correct order to win.</Typography>
            <Typography className='subtitle2' style={{ fontSize: '20px' }}>Here’s an example lottery draw, with two tickets, A and B.</Typography>
            <Typography className='subtitle2' style={{ fontSize: '20px', marginBottom: '0px' }}>-Ticket A: The first 3 digits and the last 2 digits match, but the 4th digit is wrong, so this ticket only wins a “Match first 3” prize.</Typography>
            <Typography className='subtitle2' style={{ fontSize: '20px' }}>-Ticket B: Even though the last 5 digits match, the first digit is wrong, so this ticket doesn’t win a prize.</Typography>
            <Typography className='subtitle2' style={{ fontSize: '20px' }}>Prize brackets don’t ‘stack’: if you match the first 3 digits in order, you’ll only win prizes from the ‘Match 3’ bracket, and not from ‘Match 1’ and ‘Match 2’.</Typography>
          </Box>

          <Grid container spacing={2} className="match-example">
            <Grid item md={1}>
            </Grid>
            <Grid item md={10} style={{ backgroundColor: '#FFF9F0', borderRadius: '30px' }}>
              <TableContainer component={Paper} style={{ boxShadow: 'none', backgroundColor: 'rgba(255, 255, 255, 0)', }}>
                <Table aria-label="collapsible table">
                  <TableHead style={{ backgroundColor: 'none !important' }}>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones1.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>1</Typography>
                      </TableCell>
                      <TableCell style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones2.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>2</Typography>
                      </TableCell>
                      <TableCell style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones3.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>3</Typography>
                      </TableCell>
                      <TableCell style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones4.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>4</Typography>
                      </TableCell>
                      <TableCell style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones5.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>5</Typography>
                      </TableCell>
                      <TableCell style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones6.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>6</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0' }}>✓</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0' }}>✓</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0' }}>✓</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: '#EA5556' }}>✘</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: '#EA5556' }}>✘</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: '#EA5556' }}>✘</Typography></TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', padding: '0px 40px' }}>Ticket(A):</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0' }}>1</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0' }}>2</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0' }}>3</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: 'rgba(59, 98, 83, 0.45)' }}>9</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: 'rgba(59, 98, 83, 0.45)' }}>5</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: 'rgba(59, 98, 83, 0.45)' }}>6</Typography></TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: '#EA5556' }}>✘</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0' }}>✓</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0' }}>✓</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0' }}>✓</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0' }}>✓</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '0' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0' }}>✓</Typography></TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '40px' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', padding: '0px 40px' }}>Ticket(B):</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '40px' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: 'rgba(59, 98, 83, 0.45)' }}>7</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '40px' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: 'rgba(59, 98, 83, 0.45)' }}>2</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '40px' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: 'rgba(59, 98, 83, 0.45)' }}>3</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '40px' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: 'rgba(59, 98, 83, 0.45)' }}>4</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '40px' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: 'rgba(59, 98, 83, 0.45)' }}>5</Typography></TableCell>
                      <TableCell style={{ textAlign: 'center', paddingBottom: '40px' }}><Typography className='subtitle2' style={{ fontSize: '20px', margin: '0', color: 'rgba(59, 98, 83, 0.45)' }}>6</Typography></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={1}>
            </Grid>
          </Grid>

          <Box sx={{ pt: 15, pb: 5 }} style={{ textAlign: 'center' }}>
            <Box>
              <Typography className='criteria-title'>Prize Funds</Typography>
            </Box>
          </Box>

          <Box sx={{ pb: 5 }} style={{ textAlign: 'center' }}>
            <Typography className='subtitle2' style={{ fontSize: '20px' }}>The digits on your ticket must match in the correct order to win.</Typography>
          </Box>

          <Grid container spacing={5}>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', pb: 5, px: 11 }} style={{ textAlign: 'center' }}>
                <Typography className='criteria-title' style={{ fontSize: '25px', WebkitTextStroke: '2px #3B6253', marginBottom: '25px' }}>Ticket Purchases</Typography>
                <Typography className='subtitle2' style={{ fontSize: '20px' }}>80% of the BONES paid by people buying tickets each round goes back into the prize pools while 20% gets "buried" and taken out of circulation to be return to the Chimp treasury.</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', pb: 5, px: 11 }} style={{ textAlign: 'center' }}>
                <Typography className='criteria-title' style={{ fontSize: '25px', WebkitTextStroke: '2px #3B6253', marginBottom: '25px' }}>High-value Solana NFTs</Typography>
                <Typography className='subtitle2' style={{ fontSize: '20px' }}>Each prize pool will feature a minimum of one popular, high-value Solana NFT. If the prize pool is not won, every seven days an additional popular, high-value Solana NFT will be added to the pool.</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', pb: 5, px: 11 }} style={{ textAlign: 'center' }}>
                <Typography className='criteria-title' style={{ fontSize: '25px', WebkitTextStroke: '2px #3B6253', marginBottom: '25px' }}>Rollover Prizes</Typography>
                <Typography className='subtitle2' style={{ fontSize: '20px' }}>All BONES token in the prize pool that are not won will roll over into the next round.</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', px: 11 }} style={{ textAlign: 'center' }}>
                <Typography className='criteria-title' style={{ fontSize: '25px', WebkitTextStroke: '2px #3B6253', marginBottom: '25px' }}>BONES Injections
                </Typography>
                <Typography className='subtitle2' style={{ fontSize: '20px' }}>25,000 BONES will be added to the prize pool after each round.
                </Typography>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ p: 3, m: 3 }} style={{ backgroundColor: 'white', borderRadius: '30px' }}>
                <Box style={{ textAlign: 'center' }}>
                  <LazyLoadImage src="match_chat.png" style={{ width: '200px' }} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }}>
                  <Box sx={{ p: 1, pb: 2.5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography className='criteria-title' style={{ fontSize: '20px', WebkitTextStroke: '2px #3B6253', lineHeight: '20px' }}>Digits matched</Typography>
                    <Typography className='criteria-title' style={{ fontSize: '20px', WebkitTextStroke: '2px #3B6253', lineHeight: '20px' }}>Prize pool allocation</Typography>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px' }}>Matches first 1</Typography>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px', color: '#FF9353' }}>2%</Typography>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px' }}>Matches first 2</Typography>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px', color: '#FF9353' }}>3%</Typography>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px' }}>Matches first 3</Typography>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px', color: '#FF9353' }}>5%</Typography>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px' }}>Matches first 4</Typography>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px', color: '#FF9353' }}>10%</Typography>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px' }}>Matches first 5</Typography>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px', color: '#FF9353' }}>20%</Typography>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px' }}>Matches first 6</Typography>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px', color: '#FF9353' }}>40%</Typography>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px' }}>BURN POOL</Typography>
                    <Typography className='subtitle2' style={{ fontSize: '20px', lineHeight: '20px', color: '#FF9353' }}>20%</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ py: 15 }} >
            <Typography className='funny-faq-title'>FUNKY FAQ</Typography>
          </Box>

          <Accordion expanded={expanded === 'panel1'} onChange={handleAccoChange('panel1')} style={{ background: 'none', boxShadow: 'none', paddingBottom: '40px' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: '#3B6253' }} />}
              style={{ borderBottom: '5px solid #3B6253', padding: '0px' }}
            >
              <Typography className='subtitle2' style={{ marginBottom: '0px' }}>What if there are no winners?</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: '#EF9FC42F', padding: '35px' }}>
              <Typography className='subtitle2' style={{ fontSize: '20px' }}>
                If there is no winner then the prize pool of unclaimed BONES rolls over to the next lottery round increasing the Jackpot!
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel2'} onChange={handleAccoChange('panel2')} style={{ background: 'none', boxShadow: 'none', paddingBottom: '40px' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: '#3B6253' }} />}
              style={{ borderBottom: '5px solid #3B6253', padding: '0px' }}
            >
              <Typography className='subtitle2' style={{ marginBottom: '0px' }}>My ticket matches several numbers but I can't claim a prize</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: '#EF9FC42F', padding: '35px' }}>
              <Typography className='subtitle2' style={{ fontSize: '20px' }}>
                Tickets are only eligible for prizes if matching numbers from left to right in the correct order of the drawing. To win, your numbers need to match the drawn numbers in the same order as the lottery bones, starting from the left of the ticket.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel3'} onChange={handleAccoChange('panel3')} style={{ background: 'none', boxShadow: 'none', paddingBottom: '40px' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: '#3B6253' }} />}
              style={{ borderBottom: '5px solid #3B6253', padding: '0px' }}
            >
              <Typography className='subtitle2' style={{ marginBottom: '0px' }}>How are prizes broken down between number brackets?</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: '#EF9FC42F', padding: '35px' }}>
              <Typography className='subtitle2' style={{ fontSize: '20px' }}>
                Each bracket's prize pool is a portion of the total BONES in each lottery round. See documentaion for more details.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel4'} onChange={handleAccoChange('panel4')} style={{ background: 'none', boxShadow: 'none', paddingBottom: '40px' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: '#3B6253' }} />}
              style={{ borderBottom: '5px solid #3B6253', padding: '0px' }}
            >
              <Typography className='subtitle2' style={{ marginBottom: '0px' }}>Can I swap my tickets back to BONES?</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: '#EF9FC42F', padding: '35px' }}>
              <Typography className='subtitle2' style={{ fontSize: '20px' }}>
                No, once purchased you will not be able to convert your ticket back to BONES.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel5'} onChange={handleAccoChange('panel5')} style={{ background: 'none', boxShadow: 'none', paddingBottom: '40px' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: '#3B6253' }} />}
              style={{ borderBottom: '5px solid #3B6253', padding: '0px' }}
            >
              <Typography className='subtitle2' style={{ marginBottom: '0px' }}>If I win, do I need to manually claim the prize?</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: '#EF9FC42F', padding: '35px' }}>
              <Typography className='subtitle2' style={{ fontSize: '20px' }}>
                Yes, you will need to click the Check Now button under "Do you feel lucky?" on the lottery page.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel6'} onChange={handleAccoChange('panel6')} style={{ background: 'none', boxShadow: 'none', paddingBottom: '40px' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: '#3B6253' }} />}
              style={{ borderBottom: '5px solid #3B6253', padding: '0px' }}
            >
              <Typography className='subtitle2' style={{ marginBottom: '0px' }}>How often is the lottery drawing?</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: '#EF9FC42F', padding: '35px' }}>
              <Typography className='subtitle2' style={{ fontSize: '20px' }}>
                There is one draw every day at 12:00 PM UTC.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel7'} onChange={handleAccoChange('panel7')} style={{ background: 'none', boxShadow: 'none', paddingBottom: '40px' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: '#3B6253' }} />}
              style={{ borderBottom: '5px solid #3B6253', padding: '0px' }}
            >
              <Typography className='subtitle2' style={{ marginBottom: '0px' }}>What transaction fee will I pay for buying tickets?</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: '#EF9FC42F', padding: '35px' }}>
              <Typography className='subtitle2' style={{ fontSize: '20px' }}>
                Every ticket purchase you make will be one transaction. Purchasing a single ticket in a lottery purchase will cost the normal amount of fees for a transaction.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel8'} onChange={handleAccoChange('panel8')} style={{ background: 'none', boxShadow: 'none', paddingBottom: '40px' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: '#3B6253' }} />}
              style={{ borderBottom: '5px solid #3B6253', padding: '0px' }}
            >
              <Typography className='subtitle2' style={{ marginBottom: '0px' }}>When is BONES added to the lottery?</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: '#EF9FC42F', padding: '35px' }}>
              <Typography className='subtitle2' style={{ fontSize: '20px' }}>
                After each drawing 25,000 BONES will automatically be added to the prize pool.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>
    </>
  )
}

export default FooterText
