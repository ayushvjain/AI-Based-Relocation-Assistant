import sys
import json

def recommend_houses(data):
    """
    Dummy function that simulates a recommendation system.
    Replace this with your actual recommendation logic.
    """

    recommendations = [
        {
            "Area Name": "Fenway",
            "Address": "165 Hemenway Unit 5",
            "Rent": 2950,
            "Violent CrimeRate": 0.2866,
            "Overall CrimeRate": 1.86,
            "Bed": 2.0,
            "Bath": 1.0
        },
        {
            "Area Name": "Fenway",
            "Address": "17 Hemenway St., Unit 3, Boston, MA",
            "Rent": 2850,
            "Violent CrimeRate": 0.2866,
            "Overall CrimeRate": 1.86,
            "Bed": 2.0,
            "Bath": 1.0
        }
    ]

    return recommendations

if __name__ == "__main__":
    # Read JSON input from stdin
    input_data = json.load(sys.stdin)

    # Process the input and generate recommendations
    recommendations = recommend_houses(input_data)

    # Output JSON response
    print(json.dumps(recommendations))
