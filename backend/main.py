from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import os
from dotenv import load_dotenv
import anthropic

load_dotenv()

app = FastAPI(title="Carbomatic API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    print("WARNING: ANTHROPIC_API_KEY not found in environment")
else:
    print(f"API key found: {api_key[:10]}...")

client = anthropic.Anthropic(
    api_key=api_key
)

class CarbCalculationRequest(BaseModel):
    weight_kg: float
    carb_load_days: int  # 2 or 3

class CarbCalculationResponse(BaseModel):
    daily_carb_grams: float
    total_carb_grams: float
    loading_days: int

class MealPlanRequest(BaseModel):
    daily_carb_grams: float
    days: int
    dietary_restrictions: List[str] = []
    meal_preferences: List[str] = []

class MealPlanResponse(BaseModel):
    meal_plan: Dict

@app.get("/")
async def root():
    return {"message": "Carbomatic API is running"}

@app.post("/calculate-carbs", response_model=CarbCalculationResponse)
async def calculate_carbs(request: CarbCalculationRequest):
    try:
        # Carb loading calculation based on duration
        if request.carb_load_days == 2:
            carbs_per_kg = 12  # Intensive 2-day load
        else:  # 3 days
            carbs_per_kg = 8   # Classic 3-day load
        
        daily_carb_grams = request.weight_kg * carbs_per_kg
        loading_days = request.carb_load_days
        total_carb_grams = daily_carb_grams * loading_days
        
        return CarbCalculationResponse(
            daily_carb_grams=daily_carb_grams,
            total_carb_grams=total_carb_grams,
            loading_days=loading_days
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-meal-plan", response_model=MealPlanResponse)
async def generate_meal_plan(request: MealPlanRequest):
    try:
        # Construct prompt for Claude
        dietary_info = ""
        if request.dietary_restrictions:
            dietary_info += f"Dietary restrictions: {', '.join(request.dietary_restrictions)}. "
        if request.meal_preferences:
            dietary_info += f"Meal preferences: {', '.join(request.meal_preferences)}. "
        
        prompt = f"""Create a detailed {request.days}-day marathon carb loading meal plan for a runner who needs {request.daily_carb_grams}g of carbs per day.

{dietary_info}

For each day, provide:
- Breakfast with carb content
- Lunch with carb content  
- Dinner with carb content
- 2-3 high-carb snacks with carb content
- Daily total carb count

Focus on:
- Easily digestible carbs
- Foods that won't cause GI distress
- Practical, accessible ingredients
- Proper hydration recommendations

Format the response as JSON with this structure:
{{
  "day_1": {{
    "breakfast": {{"meal": "description", "carbs": number}},
    "lunch": {{"meal": "description", "carbs": number}},
    "dinner": {{"meal": "description", "carbs": number}},
    "snacks": [{{"snack": "description", "carbs": number}}],
    "total_carbs": number,
    "hydration_notes": "string"
  }},
  "day_2": {{ ... }},
  "day_3": {{ ... }}
}}"""

        message = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        # Parse the response
        meal_plan_text = message.content[0].text
        
        # Try to extract JSON from the response
        import json
        try:
            start_idx = meal_plan_text.find('{')
            end_idx = meal_plan_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = meal_plan_text[start_idx:end_idx]
                meal_plan_json = json.loads(json_str)
            else:
                # Fallback if JSON parsing fails
                meal_plan_json = {"error": "Could not parse meal plan", "raw_response": meal_plan_text}
        except json.JSONDecodeError as e:
            meal_plan_json = {"error": f"JSON decode error: {str(e)}", "raw_response": meal_plan_text}
        
        return MealPlanResponse(meal_plan=meal_plan_json)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error generating meal plan: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)