from flask import Flask, request, jsonify
import subprocess
import json

app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    """
    API endpoint to get house recommendations based on user input.
    """

    try:
        # Parse input JSON from frontend
        data = request.get_json()

        current_living_conditions = data.get("current_living_conditions", [])
        preference_of_future_house = data.get("preference_of_future_house", {})

        if not current_living_conditions or not preference_of_future_house:
            return jsonify({"error": "Invalid input. Please provide both current_living_conditions and preference_of_future_house"}), 400

        input_json = json.dumps({
            "current_living_conditions": current_living_conditions,
            "preference_of_future_house": preference_of_future_house
        })

        # Call the recommendation script
        result = subprocess.run(
            ["python", "recommend_script.py"],  # Run recommend_script.py
            input=input_json,                   # Pass input JSON
            text=True,
            capture_output=True
        )

        if result.returncode != 0:
            return jsonify({"error": "Error running recommendation script", "details": result.stderr}), 500

        # Parse output from recommendation script
        recommendations = json.loads(result.stdout)

        # Return recommendations as JSON
        return jsonify({"recommendations": recommendations})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
