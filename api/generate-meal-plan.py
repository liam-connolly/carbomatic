from http.server import BaseHTTPRequestHandler
import json
import os
import anthropic

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            daily_carb_grams = data['daily_carb_grams']
            days = data['days']
            dietary_restrictions = data.get('dietary_restrictions', [])
            meal_preferences = data.get('meal_preferences', [])
            
            # Get API key from environment
            api_key = os.getenv('ANTHROPIC_API_KEY')
            if not api_key:
                raise Exception("ANTHROPIC_API_KEY not found in environment variables")
            
            client = anthropic.Anthropic(api_key=api_key)
            
            # Construct prompt for Claude
            dietary_info = ""
            if dietary_restrictions:
                dietary_info += f"Dietary restrictions: {', '.join(dietary_restrictions)}. "
            if meal_preferences:
                dietary_info += f"Meal preferences: {', '.join(meal_preferences)}. "
            
            prompt = f"""Create a detailed {days}-day carb loading meal plan for a marathon runner who needs {daily_carb_grams}g of carbs per day.

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
            try:
                start_idx = meal_plan_text.find('{')
                end_idx = meal_plan_text.rfind('}') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = meal_plan_text[start_idx:end_idx]
                    meal_plan_json = json.loads(json_str)
                else:
                    meal_plan_json = {"error": "Could not parse meal plan", "raw_response": meal_plan_text}
            except json.JSONDecodeError as e:
                meal_plan_json = {"error": f"JSON decode error: {str(e)}", "raw_response": meal_plan_text}
            
            response = {"meal_plan": meal_plan_json}
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {"detail": f"Error generating meal plan: {str(e)}"}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()