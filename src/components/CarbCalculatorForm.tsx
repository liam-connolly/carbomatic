'use client';

import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Scale as ScaleIcon } from '@mui/icons-material';

interface CarbCalculatorFormProps {
  weight: string;
  setWeight: (weight: string) => void;
  carbLoadDays: string;
  setCarbLoadDays: (days: string) => void;
  loading: boolean;
  error: string;
  onCalculate: () => void;
}

export default function CarbCalculatorForm({
  weight,
  setWeight,
  carbLoadDays,
  setCarbLoadDays,
  loading,
  error,
  onCalculate,
}: CarbCalculatorFormProps) {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography
        variant='h6'
        component='h2'
        sx={{
          fontWeight: 600,
          mb: 3,
          color: 'text.primary',
        }}
      >
        Calculate Your Marathon Carb Loading Needs
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          <TextField
            label='Your Weight'
            type='number'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder='154'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <ScaleIcon color='action' />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position='end'>lbs</InputAdornment>,
            }}
            sx={{ flex: 1 }}
            variant='outlined'
          />

          <Box sx={{ flex: 1 }}>
            <ToggleButtonGroup
              color='primary'
              value={carbLoadDays}
              exclusive
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  setCarbLoadDays(newValue);
                }
              }}
              sx={{ width: '100%' }}
            >
              <ToggleButton value='3' sx={{ flex: 1, py: 1.5 }}>
                3 Days
              </ToggleButton>
              <ToggleButton value='2' sx={{ flex: 1, py: 1.5 }}>
                2 Days
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Button
          variant='contained'
          size='large'
          onClick={onCalculate}
          disabled={loading || !weight}
          sx={{
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
          }}
        >
          {loading ? 'Calculating...' : 'Calculate Carb Needs'}
        </Button>

        {error && (
          <Alert severity='error' sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Paper>
  );
}
