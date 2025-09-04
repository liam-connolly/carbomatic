from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            weight_kg = data['weight_kg']
            marathon_duration_hours = data['marathon_duration_hours']
            intensity_level = data['intensity_level']
            
            # Basic carb loading calculation
            if intensity_level == "high":
                carbs_per_kg = 12
            else:
                carbs_per_kg = 10
            
            daily_carb_grams = weight_kg * carbs_per_kg
            loading_days = 3
            total_carb_grams = daily_carb_grams * loading_days
            
            response = {
                "daily_carb_grams": daily_carb_grams,
                "total_carb_grams": total_carb_grams,
                "loading_days": loading_days
            }
            
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
            
            error_response = {"detail": str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()