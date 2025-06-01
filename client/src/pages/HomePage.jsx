import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Paper,
    Box,
    IconButton,
    CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Description, Security, RocketLaunch } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const features = [
    {
        icon: <RocketLaunch fontSize="large" color="primary" />,
        title: "Lightning Fast",
        description: "Experience blazing speed with our optimized system.",
    },
    {
        icon: <Description fontSize="large" color="primary" />,
        title: "Document Focused",
        description: "Built specifically for professional document archiving.",
    },
    {
        icon: <Security fontSize="large" color="primary" />,
        title: "Highly Secure",
        description: "Advanced encryption and role-based access control."
    }
];

const theme = createTheme({
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    },
    palette: {
        background: {
            default: "#f9f9fb",
        },
        primary: {
            main: "#1976d2",
        },
    },
});

const HomePage = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" color="primary" elevation={1}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        DocuVault
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 2,
                    bgcolor: "background.default",
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
                        Smart Archiving for the Modern Era
                    </Typography>
                    <Typography variant="h6" align="center" paragraph>
                        DocuVault is your modern solution for secure, scalable, and smart document archiving. Join institutions that are embracing the future of digital infrastructure.
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <Button variant="contained" size="large" color="primary">
                            Get Started
                        </Button>
                    </Box>

                    <Grid container spacing={4} sx={{ mt: 6 }}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                                    {feature.icon}
                                    <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography>{feature.description}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default HomePage;
