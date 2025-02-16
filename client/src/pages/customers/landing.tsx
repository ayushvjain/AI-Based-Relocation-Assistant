import React, { useEffect, useState } from "react";
import NavBar from "../../components/navbar/index.tsx";
import Footer from "../../components/footer/index.tsx";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Fade from "@mui/material/Fade";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/get-data";

const Services: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showData, setShowData] = useState<boolean>(false); // Controls fade-in effect

  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    setShowData(false); // Hide data before new fetch
    try {
      const response = await axios.get(`${API_URL}?page=${pageNumber}&count=9`);
      console.log("response: ", response);
      setData(response.data.items);
      setTotalPages(response.data.metadata.total_pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setShowData(true), 200); // Small delay for smoother fade-in
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <React.Fragment>
      <NavBar />
      <Container sx={{ py: 6, textAlign: "start", maxWidth: "100vw !important" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          Property Listings
        </Typography>
        <Grid container spacing={4}>
          {loading
            ? [...Array(9)].map((_, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="text" sx={{ width: "80%", height: 17, mb: 1.1 }} />
                      <Skeleton variant="text" sx={{ width: "60%", height: 17, mb: 1.1 }} />
                      <Skeleton variant="text" sx={{ width: "50%", height: 17, mb: 1.05 }} />
                      <Skeleton variant="text" sx={{ width: "70%", height: 17, mb: 1 }} />
                      <Skeleton variant="text" sx={{ width: "40%", height: 17, mb: 1 }} />
                      <Skeleton variant="text" sx={{ width: "90%", height: 17, mb: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : data.map((item, index) => (
                <Fade in={showData} timeout={300} key={index}>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{item.Address}</Typography>
                        <Typography>Area: {item["Area Name"]}</Typography>
                        <Typography>Bedrooms: {item.Bed}</Typography>
                        <Typography>Bathrooms: {item.Bath}</Typography>
                        <Typography>Rent: ${item.Rent}</Typography>
                        <Typography>Crime Rate: {item["Overall CrimeRate"]}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Fade>
              ))}
        </Grid>
        <Stack spacing={2} sx={{ mt: 4, display: "flex", alignItems: "center" }}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
        </Stack>
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default Services;
