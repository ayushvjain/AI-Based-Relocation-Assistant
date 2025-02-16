from flask import Flask, jsonify, request
import csv
import os
import math

app = Flask(__name__)

CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), 'updated_crime_rates.csv')

def csv_to_json(csv_file_path):
    with open(csv_file_path, mode='r') as file:
        csv_reader = csv.DictReader(file)
        data = [row for row in csv_reader]
    return data

@app.route('/get-data', methods=['GET'])
def get_data():
    # Get query parameters for pagination
    try:
        page_number = int(request.args.get('page', 1))  # Default page is 1
        count_per_page = int(request.args.get('count', 15))  # Default count per page is 15
    except ValueError:
        return jsonify({'error': 'Invalid parameters'}), 400

    # Get the full data
    data = csv_to_json(CSV_FILE_PATH)
    
    # Calculate the start and end indices for slicing the data
    start_index = (page_number - 1) * count_per_page
    end_index = start_index + count_per_page

    # Slice the data to return only the relevant items
    paginated_data = data[start_index:end_index]

    total_pages = math.ceil(len(data)/count_per_page) # total pages
    # Prepare the response format
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
