from flask import Flask, jsonify, request
from flask_cors import CORS
import csv
import os
import math

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), 'updated_crime_rates.csv')

def csv_to_json(csv_file_path):
    with open(csv_file_path, mode='r') as file:
        csv_reader = csv.DictReader(file)
        data = [row for row in csv_reader]
    return data

@app.route('/get-data', methods=['GET'])
def get_data():
    try:
        page_number = int(request.args.get('page', 1))  # Default page is 1
        count_per_page = int(request.args.get('count', 15))  # Default count per page is 15
    except ValueError:
        return jsonify({'error': 'Invalid parameters'}), 400

    data = csv_to_json(CSV_FILE_PATH)
    
    start_index = (page_number - 1) * count_per_page
    end_index = start_index + count_per_page
    paginated_data = data[start_index:end_index]

    total_pages = math.ceil(len(data) / count_per_page)
    
    response = {
        'items': paginated_data,
        'metadata': {
            'total_data': len(data),
            'current_page': page_number,
            'count': count_per_page,
            'total_pages': total_pages
        }
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)
