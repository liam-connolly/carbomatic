'use client';

import { useState } from 'react';

// API base URL - works for both dev and production
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:8000';
  }
  return '';
};

interface CarbResult {
  daily_carb_grams: number;
  total_carb_grams: number;
  loading_days: number;
}

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


export default function Home() {
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('moderate');
  const [carbResult, setCarbResult] = useState<CarbResult | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateCarbs = async () => {
    if (!weight || !duration) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiUrl()}/api/calculate-carbs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight_kg: parseFloat(weight),
          marathon_duration_hours: parseFloat(duration),
          intensity_level: intensity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate carbs');
      }

      const result = await response.json();
      setCarbResult(result);
    } catch (err) {
      setError('Error calculating carbs. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const generateMealPlan = async () => {
    if (!carbResult) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiUrl()}/api/generate-meal-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          daily_carb_grams: carbResult.daily_carb_grams,
          days: carbResult.loading_days,
          dietary_restrictions: [],
          meal_preferences: [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const result = await response.json();
      setMealPlan(result.meal_plan);
    } catch (err) {
      setError('Error generating meal plan. Make sure you have sufficient Claude API credits.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900 mb-8'>
            🏃‍♂️ Carbomatic - Marathon Carb Loading Calculator
          </h1>
        </div>

        {/* Carb Calculator Form */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <h2 className='text-xl font-semibold mb-4'>
            Calculate Your Carb Loading Needs
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Weight (kg)
              </label>
              <input
                type='number'
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='70'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Expected Marathon Time (hours)
              </label>
              <input
                type='number'
                step='0.5'
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='4.5'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Intensity Level
              </label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='moderate'>Moderate</option>
                <option value='high'>High</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculateCarbs}
            disabled={loading}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Calculating...' : 'Calculate Carb Needs'}
          </button>

          {error && (
            <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
              {error}
            </div>
          )}
        </div>

        {/* Carb Results */}
        {carbResult && (
          <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
            <h2 className='text-xl font-semibold mb-4'>
              Your Carb Loading Plan
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              <div className='text-center p-4 bg-blue-50 rounded-lg'>
                <div className='text-2xl font-bold text-blue-600'>
                  {Math.round(carbResult.daily_carb_grams)}g
                </div>
                <div className='text-sm text-gray-600'>Carbs per day</div>
              </div>
              <div className='text-center p-4 bg-green-50 rounded-lg'>
                <div className='text-2xl font-bold text-green-600'>
                  {carbResult.loading_days} days
                </div>
                <div className='text-sm text-gray-600'>Loading period</div>
              </div>
              <div className='text-center p-4 bg-purple-50 rounded-lg'>
                <div className='text-2xl font-bold text-purple-600'>
                  {Math.round(carbResult.total_carb_grams)}g
                </div>
                <div className='text-sm text-gray-600'>Total carbs</div>
              </div>
            </div>

            <button
              onClick={generateMealPlan}
              disabled={loading}
              className='w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading
                ? 'Generating Meal Plan...'
                : 'Generate AI Meal Plan with Claude'}
            </button>
            
          </div>
        )}

        {/* Meal Plan Results */}
        {mealPlan && (
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold mb-4'>
              Your Personalized Meal Plan
            </h2>
            
            {Object.entries(mealPlan).map(([day, plan]) => (
              <div
                key={day}
                className='mb-6 p-4 border border-gray-200 rounded-lg'
              >
                <h3 className='text-lg font-semibold mb-3 capitalize'>
                  {day.replace('_', ' ')}
                </h3>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <h4 className='font-medium text-gray-700 mb-2'>🍳 Breakfast</h4>
                    <p className='text-sm'>{plan.breakfast.meal}</p>
                    <p className='text-xs text-blue-600 font-medium'>{plan.breakfast.carbs}g carbs</p>
                  </div>
                  
                  <div>
                    <h4 className='font-medium text-gray-700 mb-2'>🥗 Lunch</h4>
                    <p className='text-sm'>{plan.lunch.meal}</p>
                    <p className='text-xs text-blue-600 font-medium'>{plan.lunch.carbs}g carbs</p>
                  </div>
                  
                  <div>
                    <h4 className='font-medium text-gray-700 mb-2'>🍽️ Dinner</h4>
                    <p className='text-sm'>{plan.dinner.meal}</p>
                    <p className='text-xs text-blue-600 font-medium'>{plan.dinner.carbs}g carbs</p>
                  </div>
                  
                  <div>
                    <h4 className='font-medium text-gray-700 mb-2'>🍌 Snacks</h4>
                    {plan.snacks.map((snack, index) => (
                      <div key={index} className='text-sm mb-1'>
                        <p>{snack.snack}</p>
                        <p className='text-xs text-blue-600 font-medium'>{snack.carbs}g carbs</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className='mt-3 pt-3 border-t border-gray-200'>
                  <p className='font-medium text-green-600'>
                    Daily Total: {plan.total_carbs}g carbs
                  </p>
                  {plan.hydration_notes && (
                    <p className='text-sm text-gray-600 mt-1'>
                      💧 {plan.hydration_notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
