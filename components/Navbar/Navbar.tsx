import React from 'react'
import { useRouter } from 'next/router'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import * as anchor from "@project-serum/anchor"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios"
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui"
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";

import {
  useAnchorWallet, useConnection, useWallet,
} from "@solana/wallet-adapter-react";

import { useEffect, useState } from "react";

const Navbar = () => {
  const { publicKey, signTransaction } = useWallet()
  const router = useRouter();
  const wallet = useAnchorWallet();
  const [balances, setBalances] = useState({ solBalance: 0, coreBalance: 0 });
  const [receivableToken, setReceivableToken] = useState(0);
  const [isDisabled, setDisabled] = useState(false);

  const connection = new anchor.web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await connection.getBalance(wallet.publicKey);

        let rewardTokenAddr: any = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
        const valknutTokenAccount = await connection.getTokenAccountsByOwner(wallet.publicKey, { mint: new PublicKey(rewardTokenAddr) });
        // const valknutGoldTokenAccount = await connection.getTokenAccountsByOwner(wallet.publicKey, { mint: new PublicKey("HHXMCAQGw4SNfwJ3FqTJdFgt2M8GqggFk9cRm4jLYPDB") });
        try {
          const coreBalanceArray = await connection.getTokenAccountBalance(valknutTokenAccount.value[0].pubkey);
          // const valknutGoldBalanceArray = await connection.getTokenAccountBalance(valknutGoldTokenAccount.value[0].pubkey);
          setBalances({
            solBalance: balance / LAMPORTS_PER_SOL,
            coreBalance: parseFloat(coreBalanceArray.value.amount) / 100
            // valknutGoldBalance: valknutGoldBalanceArray.value.amount 
          });
        } catch {
          setBalances({ solBalance: balance / LAMPORTS_PER_SOL, coreBalance: 0 });
        }
      }
    })();
  }, [wallet]);

  useEffect(() => {
    if (wallet) loadTokens()
    // eslint-disable-next-line
  }, [wallet]);

  const headers = {
    "Access-Control-Allow-Origin": "*"
  }

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
    setDisabled(true);
    if (!process.env.NEXT_PUBLIC_LOCKED_WALLET) return;
    try {
      if (!publicKey || !signTransaction) throw new WalletNotConnectedError();

      // eslint-disable-next-line
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/withdraw_token`, {
        walletAddress: publicKey.toString(),
      })
        .then(function (response) {
          if (response.data.success) {
            setReceivableToken(0);
          } else {

          }
        })
        .catch(function (error) {
          console.log(error)
        });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <Box style={{
        background: '#1c1c1cc7',
        borderRadius: '5px',
      }} sx={{ mx: 2, p: 2 }}>
        <Box className="navLinks" style={{ marginBottom: '200px' }}>
          <Button onClick={() => router.push('/lottery')} style={{ color: router.pathname === '/lottery' ? '#37e486' : '#7f7a71', width: '100%', backgroundColor: router.pathname === '/lottery' ? '#16462f' : 'none' }} sx={{ p: 2 }}>
            LOTTERY
          </Button>
        </Box>

        <Box sx={{ px: 1, m: 1 }}>
          <Typography style={{
            fontFamily: 'Luckiest Guy',
            color: '#7f7a71',
            fontSize: '16px'
          }}>
            BALANCE
          </Typography>
        </Box>

        <Box style={{
          background: '#332f3e',
          borderRadius: '5px',
        }} sx={{ p: 1.5, m: 1 }}>
          <Typography style={{
            fontFamily: 'Luckiest Guy',
            color: 'white',
            fontSize: '16px'
          }}>
            $SOL
          </Typography>
          <Typography style={{
            fontFamily: 'Luckiest Guy',
            color: '#37e486',
            fontSize: '14px'
          }}>
            {balances.solBalance}
          </Typography>
        </Box>

        <Box style={{
          background: '#332f3e',
          borderRadius: '5px',
        }} sx={{ p: 1.5, m: 1 }}>
          <Typography style={{
            fontFamily: 'Luckiest Guy',
            color: 'white',
            fontSize: '16px'
          }}>
            $BONES
          </Typography>
          <Typography style={{
            fontFamily: 'Luckiest Guy',
            color: '#37e486',
            fontSize: '14px'
          }}>
            {balances.coreBalance}
          </Typography>
        </Box>

        <Box style={{
          background: '#332f3e',
          borderRadius: '5px',
        }} sx={{ p: 1.5, m: 1 }}>
          <Typography style={{
            fontFamily: 'Luckiest Guy',
            color: 'white',
            fontSize: '16px'
          }}>
            REWARD $BONES
          </Typography>
          <Typography style={{
            fontFamily: 'Luckiest Guy',
            color: '#37e486',
            fontSize: '14px'
          }}>
            {receivableToken}
          </Typography>
        </Box>

        {receivableToken !== 0 ? (
          <Button disabled={isDisabled} onClick={withDrawBones}>
            Claim $Core{" "}
          </Button>
        ) : (
          ""
        )}
      </Box>
    </>
  )
}

export default Navbar
