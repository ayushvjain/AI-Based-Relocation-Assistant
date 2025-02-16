import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import numpy as np

def scale(data, input):
    dataMin = np.min(data)
    dataMax = np.max(data)

    # Apply MinMax scaling to the single value
    scaledData = (data - dataMin) / (dataMax - dataMin)
    scaledInput = (input - dataMin) / (dataMax - dataMin)

    return scaledData, scaledInput

def recommend(data, location, rent, violent, overall, bed, bath, transitDistance, scaling_factors = [1, 1, 1]):

    dataRent = data['Rent']
    rooms = data['Bed'] + data['Bath'] * 0.5
    dataRent /= rooms
    rent /= (bed + bath * 0.5)

    rentTradeoff = ((dataRent - rent) / np.average(dataRent))
    rentTradeoff = np.exp(rentTradeoff * 2)

    data['rentTradeoff'] = (rentTradeoff)
    data['newRent'] = dataRent

    match location:
        case "Northeastern University":
            dataTransitDistance = data['Northeastern University_transit']
        case "Boston University":
            dataTransitDistance = data['Boston University_transit_distance']
        case "Boston College":
            dataTransitDistance = data['Boston College_transit_distance']


    distanceTradeoff = ((dataTransitDistance - transitDistance) / np.average(dataTransitDistance))
    distanceTradeoff = np.exp(distanceTradeoff)

    data['distanceTradeoff'] = distanceTradeoff
    dataTradeoff = rentTradeoff + distanceTradeoff


    # Calculate Base Tradeoff (Might be able to hard code as 2)
    tradeoff = np.exp((rent - rent) / np.average(dataRent)) + np.exp((transitDistance - transitDistance) / np.average(dataTransitDistance))

    # Scale Crime Data
    dataViolentCrime, violentScaled = scale(data['Violent CrimeRate'], violent)
    dataOverallCrime, overallScaled = scale(data['Overall CrimeRate'], overall)

    dataAggregatedCrime = 2 * dataViolentCrime + dataOverallCrime
    aggregatedCrime = 2 * violentScaled + overallScaled

    dataScaledCrime, scaledCrime = scale(dataAggregatedCrime, aggregatedCrime)
    dataScaledCrime *= 3

    data['Crime'] = dataScaledCrime

    # Create Feature Vectors
    scaledDataRent, scaledRent = scale(dataRent, rent)
    scaledDataTransit, scaledTransit = scale(dataTransitDistance, transitDistance)
    apartmentFeatures = list(zip(scaledDataTransit, scaledDataRent, dataTradeoff))
    


    # Original User Apartment Comparison
    # input = np.array([violentScaled, overallScaled, bedScaled, bathScaled, transitDistance, tradeoff])
    # input = np.array([tradeoff, rent])
    input = np.array([scaledTransit, scaledRent, tradeoff])
    # cosineSimilarity = cosine_similarity(input, apartmentVectors)
    # data['similarity'] = cosineSimilarity.flatten()

    if False:
        # Case where safety is first priority
        # apartmentFeatures = list(zip(scaledDataTransit, scaledDataRent, dataTradeoff, dataScaledCrime))

        # Case where rent is second priority
        dataScaledCrime = [0 if val <= 1 else val for val in dataScaledCrime]
        apartmentFeatures = list(zip(scaledDataTransit, scaledDataRent, dataTradeoff, dataScaledCrime))
        
        input = np.array([scaledTransit, scaledRent, tradeoff, 1])

    apartmentVectors = np.array(apartmentFeatures)

    correlations = []

    # Loop through each vector in the array and compute the Pearson correlation
    for vector in apartmentVectors:
        diff = input - vector
    
    # Apply scaling to the difference for each component
        scaled_diff = diff.copy()
        for i in range(len(scaling_factors)):
            scaled_diff[i] *= scaling_factors[i]

        distance = np.linalg.norm(scaled_diff)
        correlation = 1 / (1 + distance)
        correlations.append((correlation, distance))

    data['similarity'] = correlations
    data['dataTradeoff'] = dataTradeoff

    recommend = data.sort_values(by='similarity', ascending=False)

    return recommend

allData = pd.read_csv('updated_crime_rates.csv')
cleanedData = allData.dropna()
cleanedData = cleanedData[cleanedData['Northeastern University_driving'] <= 25000]

scaler = MinMaxScaler()
# data, location, rent, violent, overall, bed, bath, transitDistance
# 3300,0.38,0.07,3.0,1.0,72500.0,63246,75914.0,69459,
# temp = recommend(cleanedData, "Northeastern University", 2950, 0.2866, 1.86, 2.0, 1.0, 196.0)
# temp = recommend(cleanedData, "Northeastern University", 3600, 0.03, 0.28, 2.0, 1.0, 2652.0)
temp = recommend(cleanedData, "Boston University", 2950, 0.2866, 1.86, 2.0, 1.0, 196.0)


print("Northeastern University", 2950, 0.2866, 1.86, 2.0, 1.0, 3606.0)
# print("Northeastern University", 3600, 0.03, 0.28, 2.0, 1.0, 2652.0)

# print(temp.to_json(orient='records', lines=True))

print("Recommended Apartments for the User:")
i = 0
for index, row in temp.iterrows():
    print(f"Address  : {row['Address'], row['Area Name']}, Similarity Score: {row['similarity']}")
    print(row['newRent'], row['Boston University_transit_distance'], row['Northeastern University_transit_cost'], row['Crime'],row['Rent'], row['Bed'], row['Bath'], row['rentTradeoff'], row['distanceTradeoff'])
    i += 1

    if i == 100:
        break

