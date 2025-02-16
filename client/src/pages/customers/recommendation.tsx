import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from "../../components/navbar/index.tsx";
import axios from 'axios';
import GoogleMapComponent, { Recommendation } from '../../components/googleMaps';
import FloatingChatbot, { FloatingChatbotHandle } from '../../components/chatbot';
import routes from '../../constants/routes.json';

export interface FinalChatOutput {
  current_living_conditions: [string, string, number, number, number];
  preference_of_future_house: {
    Rent: number | null;
    Location: number | null;
    Safety: number | null;
  };
}

const RecommendationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Initialize chatbotData state from the navigation state.
  const [chatbotData, setChatbotData] = useState<FinalChatOutput | undefined>(location.state?.chatbotData);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const chatbotRef = useRef<FloatingChatbotHandle>(null);

  const handleChatComplete = (data: FinalChatOutput) => {
    setChatbotData(data);
    console.log("Chatbot data:", data);
    // Hide the chatbot modal; later the Navbar Help button can re-open it.
    setShowChatbot(false);
    if (data) {
      // Pass the final data in the navigation state to the recommendation page.
      navigate(routes.RECOMMENDATION, { state: { chatbotData: data } });
    }
  };

  useEffect(() => {
    if (chatbotData) {
      axios
        .post('http://127.0.0.1:5000/recommend', chatbotData)
        .then(response => {
          console.log("API Response:", response.data);
          setRecommendations(response.data.recommendations);
        })
        .catch(error => {
          console.error("Error fetching recommendations:", error);
        });
    }
  }, [chatbotData]);

  return (
    <React.Fragment>
      <NavBar
        onHelpClick={() => {
          // Open the chat window directly when Help is clicked.
          chatbotRef.current?.openChatWindow();
        }}
      />
      <h1>Property Recommendations</h1>
      {/* Render the Google Map with the fetched recommendations */}
      <GoogleMapComponent recommendations={recommendations} />
      {/* Floating Chatbot is always mounted so the floating icon appears on refresh */}
      <FloatingChatbot ref={chatbotRef} onChatComplete={handleChatComplete} />
    </React.Fragment>
  );
};

export default RecommendationPage;
