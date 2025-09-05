'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  Divider,
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
  onGenerateMealPlan: (foodPreferences: string[]) => void;
  onBack?: () => void;
}

export default function CarbResults({
  carbResult,
  loading,
  onGenerateMealPlan,
  onBack,
}: CarbResultsProps) {
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [customFood, setCustomFood] = useState('');

  const predefinedFoods = [
    'Bagels', 'Rice', 'Oatmeal', 'Pancakes', 'Pasta', 'Bread', 
    'Quinoa', 'Sweet Potatoes', 'Bananas', 'Dates', 'Honey',
    'Granola', 'Cereal', 'Toast', 'Muffins', 'Crackers',
    'Pretzels', 'Sports Drinks', 'Energy Bars'
  ];

  const toggleFood = (food: string) => {
    setSelectedFoods(prev => 
      prev.includes(food) 
        ? prev.filter(f => f !== food)
        : [...prev, food]
    );
  };

  const addCustomFood = () => {
    if (customFood.trim() && !selectedFoods.includes(customFood.trim())) {
      setSelectedFoods(prev => [...prev, customFood.trim()]);
      setCustomFood('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomFood();
    }
  };

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

      <Divider sx={{ my: 3 }} />

      {/* Food Preferences Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Food Preferences (Optional)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select foods you like to include in your meal plan, or add your own:
        </Typography>
        
        {/* Predefined Food Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {predefinedFoods.map((food) => (
            <Chip
              key={food}
              label={food}
              clickable
              color={selectedFoods.includes(food) ? 'primary' : 'default'}
              variant={selectedFoods.includes(food) ? 'filled' : 'outlined'}
              onClick={() => toggleFood(food)}
              sx={{
                '&:hover': {
                  backgroundColor: selectedFoods.includes(food) 
                    ? 'primary.dark' 
                    : 'action.hover'
                }
              }}
            />
          ))}
        </Box>

        {/* Custom Food Input */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            label="Add custom food"
            variant="outlined"
            size="small"
            value={customFood}
            onChange={(e) => setCustomFood(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ flex: 1 }}
            placeholder="e.g., Brown rice, Waffles..."
          />
          <Button
            variant="outlined"
            size="medium"
            onClick={addCustomFood}
            disabled={!customFood.trim()}
            sx={{ height: '40px' }}
          >
            Add
          </Button>
        </Box>

        {/* Selected Foods Display */}
        {selectedFoods.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Selected foods ({selectedFoods.length}):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedFoods.map((food) => (
                <Chip
                  key={food}
                  label={food}
                  size="small"
                  color="primary"
                  onDelete={() => toggleFood(food)}
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {onBack && (
          <Button
            variant='outlined'
            size='large'
            onClick={onBack}
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              minWidth: 120,
            }}
          >
            Back
          </Button>
        )}
        <Button
          variant='contained'
          size='large'
          color='success'
          onClick={() => onGenerateMealPlan(selectedFoods)}
          disabled={loading}
          startIcon={<RestaurantIcon />}
          sx={{
            flex: 1,
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
      </Box>
    </Paper>
  );
}
