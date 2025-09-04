'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  CalendarToday as CalendarIcon,
  LocalDining as DiningIcon,
} from '@mui/icons-material';

interface CarbResult {
  daily_carb_grams: number;
  total_carb_grams: number;
  loading_days: number;
}

interface CarbResultsProps {
  carbResult: CarbResult;
  loading: boolean;
  onGenerateMealPlan: () => void;
}

export default function CarbResults({
  carbResult,
  loading,
  onGenerateMealPlan,
}: CarbResultsProps) {
  const resultCards = [
    {
      title: 'Daily Carbs',
      value: `${Math.round(carbResult.daily_carb_grams)}g`,
      subtitle: 'Per day',
      icon: <RestaurantIcon />,
      color: '#1976d2',
    },
    {
      title: 'Loading Period',
      value: `${carbResult.loading_days} days`,
      subtitle: 'Duration',
      icon: <CalendarIcon />,
      color: '#2e7d32',
    },
    {
      title: 'Total Carbs',
      value: `${Math.round(carbResult.total_carb_grams)}g`,
      subtitle: 'Overall',
      icon: <DiningIcon />,
      color: '#7b1fa2',
    },
  ];

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
        Your Carb Loading Plan
      </Typography>

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          gap: 2,
          mb: 3 
        }}
      >
        {resultCards.map((card, index) => (
          <Card
            key={index}
            elevation={1}
            sx={{
              flex: 1,
              textAlign: 'center',
              border: `2px solid ${card.color}`,
              backgroundColor: `${card.color}08`,
            }}
          >
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ color: card.color, mb: 1 }}>{card.icon}</Box>
              <Typography
                variant='h4'
                component='div'
                sx={{
                  fontWeight: 700,
                  color: card.color,
                  mb: 0.5,
                }}
              >
                {card.value}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {card.subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Button
        variant='contained'
        size='large'
        color='success'
        onClick={onGenerateMealPlan}
        disabled={loading}
        startIcon={<RestaurantIcon />}
        sx={{
          width: '100%',
          py: 1.5,
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '1rem',
        }}
      >
        {loading
          ? 'Generating Meal Plan...'
          : 'Generate AI Meal Plan with Claude'}
      </Button>
    </Paper>
  );
}
