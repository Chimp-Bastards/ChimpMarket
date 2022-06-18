import React, { FC } from 'react'
import clsx from 'clsx';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface Props {
  title: string;
  description: string;
  maxValue: number;
  selected?: boolean;
  disabled?: boolean;
  handleClick: (value: string) => void;
}

const EvolutionType: FC<Props> = (props) => {

  const { title, description, maxValue, selected, handleClick, disabled } = props

  const classNames = clsx(
    "bg-white",
    "typeBtn",
    {
      "selected": selected      
    }
  )

  return (
    <Box className={clsx("evolutionType", {"disabled": disabled})}>
      {/* <Button className={classNames} onClick={() => handleClick(title)}>
        { title }
      </Button> */}
      <Box className="typeContent">
        <Typography variant='body1' align='center'>
          { description }
        </Typography>
      </Box>
      <Typography variant='body1' align='center' className="maxValue">
        Maximum Evolutions: <span>{ maxValue }</span>
      </Typography>
    </Box>
  )
}

export default EvolutionType
