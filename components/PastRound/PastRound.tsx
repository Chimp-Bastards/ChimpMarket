import React, { FC } from 'react'
import { useRouter } from 'next/router'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import * as anchor from "@project-serum/anchor"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios"
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui"
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import BuyTicketModal from 'components/BuyTicketModal'

import {
  useAnchorWallet, useConnection, useWallet,
} from "@solana/wallet-adapter-react";

import { useEffect, useState } from "react";
import { makeStyles } from '@mui/styles';

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

import { ToastContainer, toast, Zoom } from 'react-toastify'

import { Container } from '@mui/material'
import PastTicketsModal from 'components/PastTicketsModal'

interface Props {
  nextRound: any
  getPastRound: (number: any) => void
  getNextRound: () => void
  pastRound: any
  setPastRound: any
  tokenPrice: any
  MATCH_OPTION: any
  pastTickets: any
  setLoading: any
  nextTickets: any
  setNextTickets: any
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const PastRound: FC<Props> = (props) => {
  const { nextRound, getPastRound, getNextRound, pastRound, setPastRound, tokenPrice, MATCH_OPTION, pastTickets, setLoading, nextTickets, setNextTickets } = props

  const [openBuyTicketModal, setOpenBuyTicketModal] = useState(false)
  const [openViewTicketsModal, setOpenViewTicketsModal] = useState(false)
  const [tickets, setTickets] = useState<any>([])
  const { publicKey, signTransaction } = useWallet()

  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState<string | false>(false);

  const [rows, setRows] = useState<any>([])

  const [isDetailed, setIsDetailed] = useState(false)
  const [receivableToken, setReceivableToken] = useState(0);
  const [isDisabled, setDisabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const headers = {
    "Access-Control-Allow-Origin": "*"
  }

  const renderSeries = (value: any) => {
    var s = value + "";
    while (s.length < 6) s = "0" + s;
    return s;
  }

  const getYourPastRoundDetail = async (roundId: any) => {
    if (!publicKey) {
      return
    }

    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/past-your-round`, {
      roundId
    }, { headers })

    if (data.round) {
      setPastRound({
        number: data.round.roundNumber,
        series: renderSeries(data.round.series),
        prize: data.round.prize,
        drawAt: data.round.drawAt,
        cooldown: Math.floor((new Date(data.round.drawAt).valueOf() - new Date(data.time).valueOf()) / 1000),
        oneWinning: data.round.oneWinning,
        twoWinning: data.round.twoWinning,
        threeWinning: data.round.threeWinning,
        fourWinning: data.round.fourWinning,
        fiveWinning: data.round.fiveWinning,
        sixWinning: data.round.sixWinning,
      })

      setIsDetailed(true)
    }
  }

  const backToHistory = async () => {
    setIsDetailed(false)
  }

  const getAllYourRounds = async () => {
    if (!publicKey) {
      return
    }

    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/all-your-round`, {
      walletAddress: publicKey.toString(),
    }, { headers })

    if (data.rounds) {
      let tmp = []
      for (let i = 0; i < data.rounds.length; i++) {
        tmp.push(data.rounds[i]);
      }
      setRows(tmp)
    }
  }

  const handleAccoChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChange = (event: any, newValue: any) => {
    if (newValue == 0) { // all
      getPastRound(nextRound.number - 1)
    } else if (newValue == 1) { // your
      getAllYourRounds()
    }

    setIsDetailed(false)
    setValue(newValue);
  };

  useEffect(() => {
    if (publicKey) loadTokens()
    // eslint-disable-next-line
  }, [publicKey]);

  const loadTokens = async () => {
    setReceivableToken(0)
    try {
      if (!publicKey || !signTransaction) throw new WalletNotConnectedError()
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/bones`, {
        walletAddress: publicKey.toString()
      }, { headers }).then(function (response) {
        if (response.data.tokenAmount === undefined)
          setReceivableToken(0)
        else
          setReceivableToken(response.data.tokenAmount)
      }).catch(
        function (error) {
          console.log(error)
          setReceivableToken(0)
        }
      )
    } catch (error: any) {
      console.log(error)
    }
  }

  const withDrawBones = async () => {
    setLoading(true)
    setDisabled(true);
    if (!process.env.NEXT_PUBLIC_LOCKED_WALLET) return;
    try {
      if (!publicKey || !signTransaction) throw new WalletNotConnectedError();

      // eslint-disable-next-line
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/withdraw_token`, {
        walletAddress: publicKey.toString(),
      }).then(function (response) {
        if (response.data.success) {
          toast.success("You got the bones!")
          setReceivableToken(0);
        } else {
          toast.error("You didn't get the bones!")
        }
      }).catch(function (error) {
        console.log(error)
        toast.error("Something went wrong!")
      });
    } catch (error: any) {
      console.log(error);
      toast.error("Something went wrong!")
    }

    setIsChecked(false);
    setLoading(false)
  };

  const checkNow = async () => {
    setIsChecked(true);
  }

  return (
    <>
      <Box className='pastround-wrapper'>
        <Container>
          {
            !publicKey ? (
              <>
                <Box sx={{ py: 5 }}>
                  <Typography className='title' style={{ color: '#EA5556', fontSize: '50px', lineHeight: '115%' }}>DO YOU FEEL</Typography>
                  <Typography className='title' style={{ color: '#EA5556', fontSize: '50px', lineHeight: '115%' }}>LUCKY AND</Typography>
                  <Typography className='title' style={{ color: '#EA5556', fontSize: '50px', lineHeight: '115%' }}>FUNKY?</Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                  <WalletMultiButton className="red-button" />
                </Box>
              </>
            ) : (
              !isChecked ? (
                <>
                  <Box sx={{ py: 5 }}>
                    <Typography className='title' style={{ color: '#EA5556', fontSize: '50px', lineHeight: '115%' }}>DO YOU FEEL</Typography>
                    <Typography className='title' style={{ color: '#EA5556', fontSize: '50px', lineHeight: '115%' }}>LUCKY AND</Typography>
                    <Typography className='title' style={{ color: '#EA5556', fontSize: '50px', lineHeight: '115%' }}>FUNKY?</Typography>
                  </Box>
                  <Box style={{ textAlign: 'center' }}>
                    <Button className="red-button" onClick={checkNow}>Check Now</Button>
                  </Box>
                </>
              ) : (
                receivableToken == 0 ? (
                  <>
                    <Box sx={{ py: 3 }} >
                      <Typography className='title' style={{ color: '#EA5556', fontSize: '50px', lineHeight: '115%' }}>Oh, feels bad</Typography>
                    </Box>
                    <Box style={{ textAlign: 'center' }}>
                      <Typography style={{ fontFamily: 'Luckiest Guy', fontSize: '25px', color: '#FFF9F0', WebkitTextStroke: '2px black' }}>BETTER LUCK NEXT TIME</Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ py: 3 }} >
                      <Typography className='title' style={{ color: '#EA5556', fontSize: '50px', lineHeight: '115%' }}>You look Lucky</Typography>
                    </Box>
                    <Box style={{ textAlign: 'center' }}>
                      <Typography style={{ fontFamily: 'Luckiest Guy', fontSize: '25px', color: '#FFF9F0', WebkitTextStroke: '2px black' }}>you won {Math.floor(receivableToken * 100) / 100.0} $bones</Typography>
                    </Box>
                    <Box style={{ textAlign: 'center' }}>
                      <Button disabled={isDisabled} onClick={withDrawBones}><LazyLoadImage src='claim.png' style={{ width: '150px' }}/></Button>
                    </Box>
                  </>
                )
              )
            )
          }

          <Box sx={{ py: 10 }} >
            <Typography className='title'>finished</Typography>
            <Typography className='title'>rounds</Typography>
          </Box>

          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="ALL" className='roundOption' />
            <Tab label="YOURS" className='roundOption' />
          </Tabs>

          <TabPanel value={value} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }} style={{ textAlign: 'center' }}>
              <Box sx={{ py: 1 }} onClick={() => {
                getPastRound(pastRound.number - 1)
              }}>
                <Button><LazyLoadImage src="round_prev.png" width="100%" /></Button>
              </Box>
              <Box sx={{ px: 3 }}>
                <Typography className='subtitle2'>ROUND {pastRound.number}</Typography>
              </Box>
              <Box sx={{ py: 1 }} onClick={() => {
                getPastRound(pastRound.number + 1)
              }}>
                <Button><LazyLoadImage src="round_next.png" width="100%" /></Button>
              </Box>
            </Box>

            {/* winning number */}
            <Grid container style={{ marginTop: '20px' }}>
              <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                <LazyLoadImage src="Bones1.png" style={{ width: '70%' }} />
                <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[0] : ''}</Typography>
              </Grid>
              <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                <LazyLoadImage src="Bones2.png" style={{ width: '70%' }} />
                <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[1] : ''}</Typography>
              </Grid>
              <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                <LazyLoadImage src="Bones3.png" style={{ width: '70%' }} />
                <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[2] : ''}</Typography>
              </Grid>
              <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                <LazyLoadImage src="Bones4.png" style={{ width: '70%' }} />
                <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[3] : ''}</Typography>
              </Grid>
              <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                <LazyLoadImage src="Bones5.png" style={{ width: '70%' }} />
                <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[4] : ''}</Typography>
              </Grid>
              <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                <LazyLoadImage src="Bones6.png" style={{ width: '70%' }} />
                <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[5] : ''}</Typography>
              </Grid>
            </Grid>

            {
              pastTickets.length > 0 && (
                <Box className='text-center' sx={{ py: 4 }}>
                  <Button onClick={() => {
                    setOpenViewTicketsModal(true)
                  }}><LazyLoadImage src="see_tickets.png" style={{ width: '170px' }} /></Button>
                </Box>
              )
            }

            <Accordion expanded={expanded === 'panel1'} onChange={handleAccoChange('panel1')} style={{ textAlign: 'center', background: 'none', boxShadow: 'none' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className='subtitle2' sx={{ width: '100%', flexShrink: 0 }} style={{ fontSize: '30px' }}>
                  DETAILS
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className='subtitle2' style={{ fontSize: '80px' }}>${Math.floor((pastRound.prize * tokenPrice) * 100) / 100.0}</Typography>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                      <Typography className='subtitle'>match first 1</Typography>
                      <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[1]) * 100) / 100.0} $Bones</Typography>
                      <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[1] * tokenPrice) * 100) / 100.0}</Typography>
                      <Typography className='subtitle4'>{pastRound.oneWinning} winners</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                      <Typography className='subtitle'>match first 2</Typography>
                      <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[2]) * 100) / 100.0} $Bones</Typography>
                      <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[2] * tokenPrice) * 100) / 100.0}</Typography>
                      <Typography className='subtitle4'>{pastRound.twoWinning} winners</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                      <Typography className='subtitle'>match first 3</Typography>
                      <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[3]) * 100) / 100.0} $Bones</Typography>
                      <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[3] * tokenPrice) * 100) / 100.0}</Typography>
                      <Typography className='subtitle4'>{pastRound.threeWinning} winners</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                      <Typography className='subtitle'>match first 4</Typography>
                      <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[4]) * 100) / 100.0} $Bones</Typography>
                      <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[4] * tokenPrice) * 100) / 100.0}</Typography>
                      <Typography className='subtitle4'>{pastRound.fourWinning} winners</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                      <Typography className='subtitle'>match first 5</Typography>
                      <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[5]) * 100) / 100.0} $Bones</Typography>
                      <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[5] * tokenPrice) * 100) / 100.0}</Typography>
                      <Typography className='subtitle4'>{pastRound.fiveWinning} winners</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                      <Typography className='subtitle' style={{ color: '#EA5556' }}>BURN</Typography>
                      <Typography className='subtitle4'>{Math.floor((pastRound.prize * 0.2) * 100) / 100.0} $Bones</Typography>
                      <Typography className='subtitle'>${Math.floor((pastRound.prize * 0.2 * tokenPrice) * 100) / 100.0}</Typography>
                      {/* <Typography className='subtitle4'>{pastRound.sixWinning} winners</Typography> */}
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', flexDirection: 'column', py: 5 }} style={{ textAlign: 'center' }}>
                  <Typography className='subtitle'>match All 6</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }} style={{ textAlign: 'center' }}>
                    <Box>
                      <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[6]) * 100) / 100.0} $Bones</Typography>
                      <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[6] * tokenPrice) * 100) / 100.0}</Typography>
                    </Box>
                    <Box sx={{ px: 3 }}>
                      <Typography variant='h3' className="" style={{ color: 'white' }}>+</Typography>
                    </Box>
                    <Box>
                      <Typography className='subtitle4'>BLUE CHIP NFT</Typography>
                      <Typography className='subtitle4'>PRIZE POOL</Typography>
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </TabPanel>
          <TabPanel value={value} index={1}>
            {
              !publicKey ? (
                <>
                  <Box sx={{ p: 5 }} style={{ textAlign: 'center' }}>
                    <Typography style={{ color: '#EAE8DF', fontFamily: 'Luckiest Guy', fontSize: '25px', }}>Connect your wallet to check your history</Typography>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    p: 5,
                  }}>
                    <WalletMultiButton className="blue-wallet-connect-button" />
                  </Box>
                </>
              ) : (
                !isDetailed ? (
                  <>
                    {
                      rows.length == 0 ? (
                        <>
                          <Box sx={{ p: 5 }} style={{ textAlign: 'center' }}>
                            <Typography style={{ color: '#EAE8DF', fontFamily: 'Luckiest Guy', fontSize: '25px', }}>No history Found</Typography>
                          </Box>
                          <Box className='text-center'>
                            <Button variant="contained" className="btn-buy-ticket text-dark-green background-white" onClick={() => {
                              setOpenBuyTicketModal(true)
                            }}>GET YOUR TICKETS NOW!</Button>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Typography className='subtitle2' style={{ fontSize: '30px', textAlign: 'left', }}>ROUNDS</Typography>
                          <TableContainer component={Paper} style={{ boxShadow: 'none', backgroundColor: 'rgba(255, 255, 255, 0)', }}>
                            <Table aria-label="collapsible table">
                              <TableHead style={{ backgroundColor: 'none !important' }}>
                                <TableRow>
                                  <TableCell style={{ color: '#EAE8DF', fontFamily: 'Luckiest Guy', fontSize: '25px', }}>#</TableCell>
                                  <TableCell style={{ color: '#EAE8DF', fontFamily: 'Luckiest Guy', fontSize: '25px', }}>DATE</TableCell>
                                  <TableCell style={{ color: '#EAE8DF', fontFamily: 'Luckiest Guy', fontSize: '25px', }}>YOUR TICKETS</TableCell>
                                  <TableCell style={{ color: '#EAE8DF', fontFamily: 'Luckiest Guy', fontSize: '25px', }}></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {rows.map((row: any) => (
                                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell style={{ borderBottom: '0px', color: '#EAE8DF', fontFamily: 'Luckiest Guy', fontSize: '20px' }}>{row.rounds[0].roundNumber}</TableCell>
                                    <TableCell style={{ borderBottom: '0px', color: '#EAE8DF', fontFamily: 'Luckiest Guy', fontSize: '20px' }}>{row.rounds[0].drawAt}</TableCell>
                                    <TableCell style={{ borderBottom: '0px', color: '#EAE8DF', fontFamily: 'Luckiest Guy', fontSize: '20px' }}>{row.count}</TableCell>
                                    <TableCell align='right' style={{ borderBottom: '0px' }}><Button style={{ color: '#EAE8DF' }} onClick={() => {
                                      getYourPastRoundDetail(row._id)
                                    }}>{'>'}</Button></TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </>
                      )
                    }
                  </>
                ) : (
                  <>
                    <Typography className='subtitle2'>
                      <Button style={{ fontSize: '30px', textAlign: 'center', color: '#EAE8DF' }} onClick={() => {
                        backToHistory()
                      }}>{'< Back to History'}</Button>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }} style={{ textAlign: 'center' }}>
                      <Box sx={{ px: 3 }}>
                        <Typography className='subtitle2'>ROUND {pastRound.number}</Typography>
                      </Box>
                    </Box>

                    <Grid container style={{ marginTop: '20px' }}>
                      <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones1.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[0] : ''}</Typography>
                      </Grid>
                      <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones2.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[1] : ''}</Typography>
                      </Grid>
                      <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones3.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[2] : ''}</Typography>
                      </Grid>
                      <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones4.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[3] : ''}</Typography>
                      </Grid>
                      <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones5.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[4] : ''}</Typography>
                      </Grid>
                      <Grid item md={2} sm={4} xs={4} style={{ position: 'relative', textAlign: 'center' }}>
                        <LazyLoadImage src="Bones6.png" style={{ width: '70%' }} />
                        <Typography className='subtitle3' style={{ position: 'absolute', top: '30%', right: '48%' }}>{pastRound.series ? pastRound.series[5] : ''}</Typography>
                      </Grid>
                    </Grid>

                    <Box className='text-center' sx={{ py: 4 }}>
                      <Button onClick={() => {
                        setOpenViewTicketsModal(true)
                      }}><LazyLoadImage src="see_tickets.png" style={{ width: '170px' }}/></Button>
                    </Box>

                    <Accordion expanded={expanded === 'panel1'} onChange={handleAccoChange('panel1')} style={{ textAlign: 'center', background: 'none', boxShadow: 'none' }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Typography className='subtitle2' sx={{ width: '100%', flexShrink: 0 }} style={{ fontSize: '30px' }}>
                          DETAILS
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography className='subtitle2' style={{ fontSize: '80px' }}>${Math.floor((pastRound.prize * tokenPrice) * 100) / 100.0}</Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                              <Typography className='subtitle'>match first 1</Typography>
                              <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[1]) * 100) / 100.0} $Bones</Typography>
                              <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[1] * tokenPrice) * 100) / 100.0}</Typography>
                              <Typography className='subtitle4'>{pastRound.oneWinning} winners</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                              <Typography className='subtitle'>match first 2</Typography>
                              <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[2]) * 100) / 100.0} $Bones</Typography>
                              <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[2] * tokenPrice) * 100) / 100.0}</Typography>
                              <Typography className='subtitle4'>{pastRound.twoWinning} winners</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                              <Typography className='subtitle'>match first 3</Typography>
                              <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[3]) * 100) / 100.0} $Bones</Typography>
                              <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[3] * tokenPrice) * 100) / 100.0}</Typography>
                              <Typography className='subtitle4'>{pastRound.threeWinning} winners</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                              <Typography className='subtitle'>match first 4</Typography>
                              <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[4]) * 100) / 100.0} $Bones</Typography>
                              <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[4] * tokenPrice) * 100) / 100.0}</Typography>
                              <Typography className='subtitle4'>{pastRound.fourWinning} winners</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                              <Typography className='subtitle'>match first 5</Typography>
                              <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[5]) * 100) / 100.0} $Bones</Typography>
                              <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[5] * tokenPrice) * 100) / 100.0}</Typography>
                              <Typography className='subtitle4'>{pastRound.fiveWinning} winners</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', pt: 5 }} style={{ textAlign: 'center' }}>
                              <Typography className='subtitle' style={{ color: '#EA5556' }}>BURN</Typography>
                              <Typography className='subtitle4'>{Math.floor((pastRound.prize * 0.2) * 100) / 100.0} $Bones</Typography>
                              <Typography className='subtitle'>${Math.floor((pastRound.prize * 0.2 * tokenPrice) * 100) / 100.0}</Typography>
                              {/* <Typography className='subtitle4'>{pastRound.sixWinning} winners</Typography> */}
                            </Box>
                          </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', flexDirection: 'column', py: 5 }} style={{ textAlign: 'center' }}>
                          <Typography className='subtitle'>match All 6</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }} style={{ textAlign: 'center' }}>
                            <Box>
                              <Typography className='subtitle4'>{Math.floor((pastRound.prize * MATCH_OPTION[6]) * 100) / 100.0} $Bones</Typography>
                              <Typography className='subtitle'>${Math.floor((pastRound.prize * MATCH_OPTION[6] * tokenPrice) * 100) / 100.0}</Typography>
                            </Box>
                            <Box sx={{ px: 3 }}>
                              <Typography variant='h3' className="" style={{ color: 'white' }}>+</Typography>
                            </Box>
                            <Box>
                              <Typography className='subtitle4'>BLUE CHIP NFT</Typography>
                              <Typography className='subtitle4'>PRIZE POOL</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </>
                )
              )
            }
          </TabPanel>
        </Container>
      </Box >
      <BuyTicketModal
        open={openBuyTicketModal}
        handleClose={() => setOpenBuyTicketModal(false)}
        tickets={tickets}
        setLoading={setLoading}
        nextRound={nextRound}
        getNextRound={() => {
          getNextRound()
        }}
        nextTickets={nextTickets}
        setNextTickets={setNextTickets}
      />
      <PastTicketsModal
        open={openViewTicketsModal}
        handleClose={() => setOpenViewTicketsModal(false)}
        tickets={tickets}
        setTickets={setTickets}
        setLoading={setLoading}
        pastRound={pastRound}
      />
    </>
  )
}

export default PastRound

