import React, { FC } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { IconButton } from '@mui/material'

interface Props {
  open: boolean
  evolvedNFT: any
  handleClose: () => void
}

const EvolutionModal: FC<Props> = (props) => {
  const { open, evolvedNFT, handleClose } = props

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="evolution-modal-body">
        <Box className="modalContent">
          <Typography variant="h6" component="h2" className="modalTitle">
            {evolvedNFT.name}
          </Typography>
          <IconButton className="closeBtn" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Box className="content">
            <img src={evolvedNFT.image} alt="Evolution" width='100%' />
            <Typography variant='body1'>
              {evolvedNFT.name} is generated successfully!
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default EvolutionModal
