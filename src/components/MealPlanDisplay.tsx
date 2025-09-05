'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  LocalDining as DiningIcon,
  Coffee as CoffeeIcon,
  Fastfood as FastfoodIcon,
  WaterDrop as WaterIcon,
} from '@mui/icons-material';

interface MealPlan {
  [key: string]: {
    breakfast: { meal: string; carbs: number };
    lunch: { meal: string; carbs: number };
    dinner: { meal: string; carbs: number };
    snacks: { snack: string; carbs: number }[];
    total_carbs: number;
    hydration_notes: string;
  };
}

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
  onBack?: () => void;
  onStartOver?: () => void;
}

export default function MealPlanDisplay({ mealPlan, onBack, onStartOver }: MealPlanDisplayProps) {
  const mealIcons = {
    breakfast: <CoffeeIcon />,
    lunch: <RestaurantIcon />,
    dinner: <DiningIcon />,
    snacks: <FastfoodIcon />,
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography
        variant='h6'
        component='h2'
        sx={{
          fontWeight: 600,
          mb: 3,
          color: 'text.primary',
        }}
      >
        Your Personalized Meal Plan
      </Typography>

      <Grid container spacing={3}>
        {Object.entries(mealPlan).map(([day, plan], dayIndex) => (
          <Grid size={{ xs: 12 }} key={day}>
            <Card elevation={2} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant='h6'
                    component='h3'
                    sx={{
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      color: 'primary.main',
                    }}
                  >
                    {day.replace('_', ' ')}
                  </Typography>
                  <Chip
                    label={`${plan.total_carbs}g total carbs`}
                    color='success'
                    variant='filled'
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Grid container spacing={2}>
                  {/* Breakfast */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        {mealIcons.breakfast}
                        <Typography
                          variant='subtitle1'
                          sx={{ ml: 1, fontWeight: 600 }}
                        >
                          Breakfast
                        </Typography>
                      </Box>
                      <Typography variant='body2' sx={{ mb: 0.5 }}>
                        {plan.breakfast.meal}
                      </Typography>
                      <Chip
                        label={`${plan.breakfast.carbs}g carbs`}
                        size='small'
                        color='primary'
                        variant='outlined'
                      />
                    </Box>
                  </Grid>

                  {/* Lunch */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        {mealIcons.lunch}
                        <Typography
                          variant='subtitle1'
                          sx={{ ml: 1, fontWeight: 600 }}
                        >
                          Lunch
                        </Typography>
                      </Box>
                      <Typography variant='body2' sx={{ mb: 0.5 }}>
                        {plan.lunch.meal}
                      </Typography>
                      <Chip
                        label={`${plan.lunch.carbs}g carbs`}
                        size='small'
                        color='primary'
                        variant='outlined'
                      />
                    </Box>
                  </Grid>

                  {/* Dinner */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        {mealIcons.dinner}
                        <Typography
                          variant='subtitle1'
                          sx={{ ml: 1, fontWeight: 600 }}
                        >
                          Dinner
                        </Typography>
                      </Box>
                      <Typography variant='body2' sx={{ mb: 0.5 }}>
                        {plan.dinner.meal}
                      </Typography>
                      <Chip
                        label={`${plan.dinner.carbs}g carbs`}
                        size='small'
                        color='primary'
                        variant='outlined'
                      />
                    </Box>
                  </Grid>

                  {/* Snacks */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        {mealIcons.snacks}
                        <Typography
                          variant='subtitle1'
                          sx={{ ml: 1, fontWeight: 600 }}
                        >
                          Snacks
                        </Typography>
                      </Box>
                      <List dense sx={{ py: 0 }}>
                        {plan.snacks.map((snack, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                            <ListItemText
                              primary={
                                <Typography variant='body2'>
                                  {snack.snack}
                                </Typography>
                              }
                              secondary={
                                <Chip
                                  label={`${snack.carbs}g carbs`}
                                  size='small'
                                  color='primary'
                                  variant='outlined'
                                  sx={{ mt: 0.5 }}
                                />
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                </Grid>

                {/* Hydration Notes */}
                {plan.hydration_notes && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
                    >
                      <WaterIcon color='info' sx={{ mt: 0.5 }} />
                      <Typography variant='body2' color='text.secondary'>
                        <strong>Hydration:</strong> {plan.hydration_notes}
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Navigation Buttons */}
      {(onBack || onStartOver) && (
        <Box sx={{ display: 'flex', gap: 2, mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
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
          {onStartOver && (
            <Button
              variant='contained'
              size='large'
              color='primary'
              onClick={onStartOver}
              sx={{
                flex: 1,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Start Over
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
}
