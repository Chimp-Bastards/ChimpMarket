import React, { FC } from 'react'
import clsx from 'clsx'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { LazyLoadImage } from 'react-lazy-load-image-component'

interface Props {
  handlePick: () => void
  evolve?: string
  img?: string
  btnText?: string
  redMark?: boolean
}

const SamosItem: FC<Props> = (props) => {

  const { handlePick, evolve, img, btnText, redMark } = props

  return (
    <Box className="samos-item">
      <Button className={clsx("selectBtn")} onClick={() => handlePick()}>
        {btnText}
      </Button>
      <Box className={clsx("pick", { "samos-item-omega": evolve === "Omega", "red-border": redMark })} onClick={() => handlePick()}>
        {
          !!img ? (
            <LazyLoadImage src={img} alt="Samos" width="100%" height="100%" effect="blur" />
          ) : (
            <LazyLoadImage src="/add.png" alt="add" width="100%"  effect="blur" />
          )
        }
      </Box>
    </Box>
  )
}

export default SamosItem
