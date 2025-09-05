'use client';

import { useState } from 'react';
import { useQueryState } from 'nuqs';
import FAQ from './FAQ';
import CarbCalculatorForm from './CarbCalculatorForm';
import CarbResults from './CarbResults';
import MealPlanDisplay from './MealPlanDisplay';

// API base URL - works for both dev and production
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NODE_ENV === 'production'
      ? `${window.location.origin}/api`
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

export default function ContentContainer() {
  const [weight, setWeight] = useState('');
  const [carbLoadDays, setCarbLoadDays] = useState('3');
  const [carbResult, setCarbResult] = useState<CarbResult | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 1: form, 2: results, 3: meal plan
  const [faq] = useQueryState('faq');

  const calculateCarbs = async () => {
    if (!weight) {
      setError('Please enter your weight');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert weight from lbs to kg
      const weightInLbs = parseFloat(weight);
      const weightInKg = weightInLbs * 0.453592; // Convert lbs to kg

      const response = await fetch(`${getApiUrl()}/calculate-carbs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight_kg: weightInKg,
          carb_load_days: parseInt(carbLoadDays),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate carbs');
      }

      const result = await response.json();
      setCarbResult(result);
      setCurrentStep(2); // Move to results screen
    } catch (err) {
      setError('Error calculating carbs. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const generateMealPlan = async (foodPreferences: string[] = []) => {
    if (!carbResult) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiUrl()}/generate-meal-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          daily_carb_grams: carbResult.daily_carb_grams,
          days: carbResult.loading_days,
          dietary_restrictions: [],
          meal_preferences: foodPreferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const result = await response.json();
      setMealPlan(result.meal_plan);
      setCurrentStep(3); // Move to meal plan screen
    } catch (err) {
      setError(
        'Error generating meal plan. Make sure you have sufficient Claude API credits.'
      );
    } finally {
      setLoading(false);
    }
  };

  const goBackToStep = (step: number) => {
    setCurrentStep(step);
    setError('');
  };

  if (faq) {
    return <FAQ />;
  }

  // Step 1: Calculator Form
  if (currentStep === 1) {
    return (
      <CarbCalculatorForm
        weight={weight}
        setWeight={setWeight}
        carbLoadDays={carbLoadDays}
        setCarbLoadDays={setCarbLoadDays}
        loading={loading}
        error={error}
        onCalculate={calculateCarbs}
      />
    );
  }

  // Step 2: Carb Results
  if (currentStep === 2 && carbResult) {
    return (
      <CarbResults
        carbResult={carbResult}
        loading={loading}
        onGenerateMealPlan={generateMealPlan}
        onBack={() => goBackToStep(1)}
      />
    );
  }

  // Step 3: Meal Plan
  if (currentStep === 3 && mealPlan) {
    return (
      <MealPlanDisplay 
        mealPlan={mealPlan}
        onBack={() => goBackToStep(2)}
        onStartOver={() => goBackToStep(1)}
      />
    );
  }

  // Fallback to step 1
  return (
    <CarbCalculatorForm
      weight={weight}
      setWeight={setWeight}
      carbLoadDays={carbLoadDays}
      setCarbLoadDays={setCarbLoadDays}
      loading={loading}
      error={error}
      onCalculate={calculateCarbs}
    />
  );
}
