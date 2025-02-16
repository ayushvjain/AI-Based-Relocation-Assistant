# import sys
# import json

# def recommend_houses(data):
#     """
#     Dummy function that simulates a recommendation system.
#     Replace this with your actual recommendation logic.
#     """

#     recommendations = [
#         {
#             "Area Name": "Fenway",
#             "Address": "165 Hemenway Unit 5",
#             "Rent": 2950,
#             "Violent CrimeRate": 0.2866,
#             "Overall CrimeRate": 1.86,
#             "Bed": 2.0,
#             "Bath": 1.0
#         },
#         {
#             "Area Name": "Fenway",
#             "Address": "17 Hemenway St., Unit 3, Boston, MA",
#             "Rent": 2850,
#             "Violent CrimeRate": 0.2866,
#             "Overall CrimeRate": 1.86,
#             "Bed": 2.0,
#             "Bath": 1.0
#         }
#     ]

#     return recommendations

# if __name__ == "__main__":
#     # Read JSON input from stdin
#     input_data = json.load(sys.stdin)

#     # Process the input and generate recommendations
#     recommendations = recommend_houses(input_data)

#     # Output JSON response
#     print(json.dumps(recommendations))


import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import json

def scale(data, input_value):
    data_min = np.min(data)
    data_max = np.max(data)

    scaled_data = (data - data_min) / (data_max - data_min)
    scaled_input = (input_value - data_min) / (data_max - data_min)

    return scaled_data, scaled_input

def recommend(data, location, rent, violent, overall, bed, bath, transit_distance, scaling_factors=[1, 1, 1]):
    data_rent = data['Rent']
    rooms = data['Bed'] + data['Bath'] * 0.5
    data_rent /= rooms
    rent /= (bed + bath * 0.5)

    rent_tradeoff = np.exp(((data_rent - rent) / np.average(data_rent)) * 2)

    data['rentTradeoff'] = rent_tradeoff
    data['newRent'] = data_rent

    if location == "Northeastern University":
        data_transit_distance = data['Northeastern University_transit']
    elif location == "Boston University":
        data_transit_distance = data['Boston University_transit_distance']
    elif location == "Boston College":
        data_transit_distance = data['Boston College_transit_distance']
    else:
        return data.head(0)  # Return empty if location is invalid

    distance_tradeoff = np.exp(((data_transit_distance - transit_distance) / np.average(data_transit_distance)))

    data['distanceTradeoff'] = distance_tradeoff
    data_tradeoff = rent_tradeoff + distance_tradeoff

    data_violent_crime, violent_scaled = scale(data['Violent CrimeRate'], violent)
    data_overall_crime, overall_scaled = scale(data['Overall CrimeRate'], overall)

    data_aggregated_crime = 2 * data_violent_crime + data_overall_crime
    aggregated_crime = 2 * violent_scaled + overall_scaled

    data_scaled_crime, scaled_crime = scale(data_aggregated_crime, aggregated_crime)
    data_scaled_crime *= 3

    data['Crime'] = data_scaled_crime

    scaled_data_rent, scaled_rent = scale(data_rent, rent)
    scaled_data_transit, scaled_transit = scale(data_transit_distance, transit_distance)

    input_vector = np.array([scaled_transit, scaled_rent, np.mean(data_tradeoff)])

    apartment_vectors = np.array(list(zip(scaled_data_transit, scaled_data_rent, data_tradeoff)))

    correlations = []

    for vector in apartment_vectors:
        vector = np.array(vector)  # Ensure vector is NumPy array
        diff = input_vector - vector

        scaled_diff = diff * scaling_factors  # Apply preference scaling
        distance = np.linalg.norm(scaled_diff)
        correlation = 1 / (1 + distance)
        correlations.append((correlation, distance))

    # ✅ Fix: Extract only correlation values
    data['similarity'] = [c[0] for c in correlations]
    data['dataTradeoff'] = data_tradeoff

    return data.sort_values(by='similarity', ascending=False)

if __name__ == "__main__":
    all_data = pd.read_csv('updated_crime_rates.csv')
    cleaned_data = all_data.dropna()
    cleaned_data = cleaned_data[cleaned_data['Northeastern University_driving'] <= 25000]

    example_result = recommend(
        cleaned_data, "Boston University", 2950, 0.2866, 1.86, 2.0, 1.0, 196.0
    )

    print(json.dumps(example_result.head(10).to_dict(orient="records"), indent=2))
