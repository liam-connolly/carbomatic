import React from 'react';
import { Box, Typography } from '@mui/material';

export default function FAQ() {
  return (
    <Box
      sx={{
        pb: '10vh',
        px: { xs: 2, sm: 3, md: 0 },
        mx: { xs: 0, md: 'auto' },
      }}
    >
      <Typography
        variant='h6'
        component='h2'
        sx={{
          fontWeight: 700,
          marginTop: 2,
          mb: 3,
          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
        }}
      >
        Frequently Asked Questions
      </Typography>

      <Typography
        variant='h6'
        component='h3'
        sx={{
          fontWeight: 600,
          marginTop: 3,
          mb: 1,
        }}
      >
        What is carb loading?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Carb loading (or carbohydrate loading) is a dietary strategy used by
        endurance athletes to maximize glycogen stores in muscles and liver
        before a race. For marathoners, this typically involves consuming 8-12g
        of carbohydrates per kg of body weight for 2-3 days before the race.
      </Typography>

      <Typography
        variant='h6'
        component='h3'
        sx={{
          fontWeight: 600,
          marginTop: 3,
          mb: 1,
        }}
      >
        How is my recommended carb intake calculated?
      </Typography>
      <Typography sx={{ mb: 2 }}></Typography>

      <Typography
        variant='h6'
        component='h3'
        sx={{
          fontWeight: 600,
          marginTop: 3,
          mb: 1,
        }}
      >
        What types of carbs should I eat?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Focus on easily digestible carbohydrates that won't cause GI distress:
        <br />" Pasta, rice, bread, oatmeal
        <br />" Bananas, dates, and other fruits
        <br />" Sports drinks and energy bars
        <br />" Avoid high-fiber, high-fat, or unfamiliar foods
      </Typography>

      <Typography
        variant='h6'
        component='h3'
        sx={{
          fontWeight: 600,
          marginTop: 3,
          mb: 1,
        }}
      >
        How accurate are these calculations?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        The calculations are based on sports nutrition research and guidelines
        from organizations like the International Association of Athletics
        Federations (IAAF). However, individual needs may vary based on training
        status, body composition, and personal tolerance. Consider consulting
        with a sports nutritionist for personalized advice.
      </Typography>

      <Typography
        variant='h6'
        component='h3'
        sx={{
          fontWeight: 600,
          marginTop: 3,
          mb: 1,
        }}
      >
        When should I start carb loading?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Begin your carb loading protocol 2-3 days before your marathon,
        depending on which protocol you choose. The final day should end with
        your pre-race dinner. Remember to also taper your training during this
        period.
      </Typography>

      <Typography
        variant='h6'
        component='h3'
        sx={{
          fontWeight: 600,
          marginTop: 3,
          mb: 1,
        }}
      >
        Should I carb load for shorter races?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Carb loading is most beneficial for events lasting longer than 90
        minutes. For marathons (typically 3+ hours for most runners), carb
        loading can provide significant performance benefits. For shorter races
        like 5Ks or 10Ks, normal carbohydrate intake is usually sufficient.
      </Typography>

      <Typography
        variant='h6'
        component='h3'
        sx={{
          fontWeight: 600,
          marginTop: 3,
          mb: 1,
        }}
      >
        What about hydration?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Proper hydration is crucial during carb loading. For every gram of
        glycogen stored, your body stores 3-4 grams of water. Stay well-hydrated
        throughout the carb loading period, and monitor your urine color as an
        indicator of hydration status.
      </Typography>

      <Typography
        variant='h6'
        component='h3'
        sx={{
          fontWeight: 600,
          marginTop: 3,
          mb: 1,
        }}
      >
        Where can I learn more?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        For more detailed information about sports nutrition and carb loading,
        consult resources from:
        <br />"{' '}
        <a
          href='https://www.acsm.org/'
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: '#1976d2', textDecoration: 'underline' }}
        >
          American College of Sports Medicine
        </a>
        <br />"{' '}
        <a
          href='https://www.sportsdietitians.com.au/'
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: '#1976d2', textDecoration: 'underline' }}
        >
          Sports Dietitians Australia
        </a>
        <br />" Your local sports nutritionist or registered dietitian
      </Typography>

      <Typography
        variant='h6'
        component='h3'
        sx={{
          fontWeight: 600,
          marginTop: 3,
          mb: 1,
        }}
      >
        Have questions or feedback?
      </Typography>
      <Typography sx={{ mb: 2 }}>
        This tool was created to help marathon runners optimize their carb
        loading strategy. If you have questions or suggestions, feel free to
        reach out at{' '}
        <a
          href='mailto:liamconnolly.hello@gmail.com'
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: '#1976d2', textDecoration: 'underline' }}
        >
          liamconnolly.hello@gmail.com
        </a>
        .
      </Typography>
    </Box>
  );
}
