import React, { FC } from 'react'
import clsx from 'clsx'

import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Grid from '@mui/material/Grid'
import { IconButton } from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component'
// import CoolDownTimer from 'components/CoolDownTimer'

import { NFT, NFTmap } from "types/metadata"

interface Props {
  open: boolean
  handleClose: () => void
  handleSelect: (addr:string, name: string, imgSrc: string) => void
  nftsList: { [key: string]: NFTmap }
  // lockedSamos: any
  // nftType: any
}

const PickModal: FC<Props> = (props) => {
  const { 
    open, 
    handleClose, 
    handleSelect, 
    nftsList, 
    // lockedSamos, 
    // nftType 
  } = props

  const nftsInWallet: NFTmap[] = Object.values(nftsList)

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="pick-modal-body" style={{ width: '87.5vw' }}>
        <Box className="modalContent">
          <Typography variant="h6" className="modalTitle">
            Pick your NFTs :
          </Typography>
          <IconButton className="closeBtn" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Box className="contents" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Grid container columnSpacing={{ xs: 3, md: 5 }}>
              {
                nftsInWallet.map((elem) => (
                  <>
                    <Grid item xs={6} md={3} lg={3} key={elem.mint}>
                      <Box className="pick-modal-item">
                        <LazyLoadImage src={elem.NFT?.image} alt="Samos" width="100%" effect="blur" />
                        <Typography style={{ textAlign: "center" }}>
                          {elem.NFT?.name}
                        </Typography>
                        <Button variant='contained' onClick={() => handleSelect(elem.mint, elem.NFT?.name, elem.NFT?.image)}>
                          Select
                        </Button>
                      </Box>
                    </Grid>
                  </>
                ))
              }
            </Grid>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default PickModal
