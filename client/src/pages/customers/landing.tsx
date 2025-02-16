import React, { useState } from "react";
import NavBar from "../../components/navbar/index.tsx";
import Slider from "react-slick"; // Import react-slick
import "./home.css";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import CardContent from "@mui/material/CardContent";
// import { getPopularServiceTypes } from "../../services/api/customerHomeAPIs";
// import { getUserData } from "../../services/api/authAPIs.ts";
import routes from "../../constants/routes.json";
import { useNavigate } from "react-router-dom";
// import landingPageBG from "../../assets/landingpageBG.jpeg";
// import sectionFixA from "../../assets/sectionFixA.jpeg";
import { useTranslation } from 'react-i18next';
// import ContactForm from "../../components/contact-form/index.tsx";
import Footer from "../../components/footer/index.tsx";

type Service = {
    id: string;
    role_type: string;
    description: string;
    card_image: string;
};

const Services: React.FC = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // To show loading indicator while fetching

    const { t } = useTranslation();

    // const [offsetY, setOffsetY] = useState(0);

    // const handleScroll = () => {
    //     // Use requestAnimationFrame for smoother animations
    //     window.requestAnimationFrame(() => {
    //         setOffsetY(window.scrollY);
    //     });
    // };

    // useEffect(() => {
    //     window.addEventListener("scroll", handleScroll);
    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);

    // const CustomArrow = (props: any) => {
    //     const { className, style, onClick } = props;
    //     return (
    //         <div
    //             className={className}
    //             style={{
    //                 ...style,
    //                 color: "#283593",
    //                 zIndex: 2,
    //                 fontSize: "20px",
    //             }}
    //             onClick={onClick}
    //         />
    //     );
    // };

    // const fetchAllServices = async () => {
    //     setLoading(true);
    //     try {
    //         // Fetch all services (pass an empty query or use a specific API for all services)
    //         const response = await getPopularServiceTypes();

    //         // Map the response to match the Service type structure
    //         const mappedServices = response.data.map((service: any) => ({
    //             id: service._id,
    //             role_type: service.role_type,
    //             description: service.description,
    //             card_image: service.card_image,
    //         }));

    //         setServices(mappedServices); // Populate the cards with all services
    //     } catch (error) {
    //         console.error("Error fetching all services:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    interface ServiceProvider {
        role_type: string;
        id: string;
      }
    
    //   const fetchAllServiceProvider = async (service: ServiceProvider): Promise<void> => {
    //     navigate(routes.SERVICES_PROVIDERS, {
    //       state: {
    //         name: service.role_type,
    //         service_type_id:service.id
    //       },
    //     });
    //   };

    // React.useEffect(() => {
    //     const token = localStorage.getItem("AUTH_ACCESS_TOKEN");
    //     if (token) {
    //         getUserData().then((res) => {
    //             sessionStorage.setItem("email", res.data.user.email);
    //             sessionStorage.setItem("role", res.data.user.role);
    //             sessionStorage.setItem("firstName", res.data.user.firstName);
    //             sessionStorage.setItem("lastName", res.data.user.lastName);
    //             sessionStorage.setItem("id", res.data.user._id);
    //         });
    //     }
    //     fetchAllServices();
    // }, []);

    // Slider settings for react-slick
    // const sliderSettings = {
    //     dots: true,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     initialSlide: 0,
    //     autoplay: true,
    //     autoplaySpeed: 3000,
    //     pauseOnHover: true,
    //     prevArrow: <CustomArrow />,
    //     nextArrow: <CustomArrow />,
    //     responsive: [
    //         {
    //             breakpoint: 1524,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1, // Move one slide at a time
    //                 infinite: true,
    //                 dots: true,
    //             },
    //         },
    //         {
    //             breakpoint: 1324,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1, // Move one slide at a time
    //                 infinite: true,
    //                 dots: true,
    //             },
    //         },
    //         {
    //             breakpoint: 800,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1, // Move one slide at a time
    //             },
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1, // Move one slide at a time
    //             },
    //         },
    //     ],
    // };

    return (
        <React.Fragment>
            <NavBar />
            <Box
                sx={{
                    // backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(${landingPageBG})`,
                    backgroundSize: "cover",
                    backgroundPosition: `center`, // Moves the image at half the scroll speed
                    backgroundAttachment: "fixed", // Keeps the image fixed while scrolling
                    minHeight: "400px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                }}
            >
                <Container sx={{ textAlign: 'start' }}>
                    <Typography variant="h1" sx={{ fontWeight: "bold", mb: 2 }}>
                        {t('cont.exp')}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 3 }}>
                        {t('landing.subtext')}
                    </Typography>
                    <Button variant="contained" color="success" size="large" onClick={() => navigate(routes.SERVICES)}>
                        {t('View.Services')}
                    </Button>
                </Container>
            </Box>

            {/* Info Section */}
            <Container sx={{ py: 6, textAlign: 'start', maxWidth: '100vw !important' }}>
                <Grid container spacing={4} justifyContent='space-evenly'>
                    <Grid item xs={12} md={4} display='flex' flexDirection='column' justifyContent='center'>
                        <Typography variant="h4" sx={{ fontSize: '13px', fontWeight: "bold", color: '#46a225', mb: 2, textTransform: "uppercase", }}>
                            {t('Landing.Info.SubText')}
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                            {t('Landing.Info.Title')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            {t('Landing.Info.Description')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card>
                            <CardContent sx={{
                                padding: '4px !important',
                                ":hover": {
                                    cursor: 'pointer',
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s',
                                }
                            }}>
                                {/* <Box
                                    component="img"
                                    src={sectionFixA}
                                    alt="Service Illustration"
                                    sx={{
                                        width: "100%",
                                        height: '100%',
                                        borderRadius: 1
                                    }}
                                /> */}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Container sx={{ pt: 6, backgroundColor: '#eff1f0', maxWidth: '100vw !important', textAlign: 'start' }}>
                <Grid container spacing={4} padding="0px 20px">
                    <Grid item xs={12} display='flex' flexDirection='column' justifyContent='center' >
                        <Typography variant="h4" sx={{ fontSize: '13px', fontWeight: "bold", color: '#46a225', mb: 2, textTransform: "uppercase", }}>
                            {t('Landing.Carousal.SubText')}
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                            {t('Landing.Carousal.Title')}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={4} justifyContent='center' sx={{ mt: 6 }}>
                    <Grid item xs={12} display='flex' justifyContent='center'>
                        <Footer />
                    </Grid>
                    {/* <ContactForm/> */}
                    {/* <Grid item xs={12} md={6} display='flex' justifyContent='center' >
                        <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                            Contact Form
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6} display='flex' justifyContent='center' >
                        <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                            Maps
                        </Button>
                    </Grid> */}
                </Grid>
            </Container>
        </React.Fragment>
    );
};

export default Services;
