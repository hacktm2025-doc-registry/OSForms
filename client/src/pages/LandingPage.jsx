import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import '../App.css';
import { FaCloudUploadAlt, FaSearchPlus, FaShieldAlt, FaUsersCog, FaCodeBranch } from 'react-icons/fa';

// REMOVE THE GeoJSON IMPORT LINE HERE (it's no longer needed for public assets)
// import romaniaGeoData from '../assets/romania-judete.geojson'; // This line is now gone

// Helper function to normalize county names for consistent comparison
const normalizeCountyName = (name) => {
    if (!name) return "";
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ă/g, "a")
        .replace(/î/g, "i")
        .replace(/â/g, "a")
        .replace(/ș/g, "s")
        .replace(/ț/g, "t")
        .trim();
};


function LandingPage() {
    const [coloredCounties, setColoredCounties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountiesFromBackend = async () => {
            try {
                const backendUrl = `http://${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}/api/data/counties`;
                const response = await fetch(backendUrl);
                const data = await response.json();

                if (response.ok) {
                    if (Array.isArray(data.counties)) {
                        const normalized = data.counties.map(normalizeCountyName);
                        console.log("Normalized backend counties received:", normalized);
                        setColoredCounties(normalized);
                        setError(null);
                    } else {
                        setError("Backend did not return 'counties' as an array. Displaying all counties as gray.");
                    }
                } else {
                    setError(data.message || 'Failed to fetch counties data from backend. Displaying all counties as gray.');
                }
            } catch (err) {
                setError('Network error: Could not connect to backend. Displaying all counties as gray.');
                console.error('Error fetching counties:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCountiesFromBackend();
    }, []);

    const isCountyColored = (countyNameFromGeoJSON) => {
        // console.log(`Checking county: ${countyNameFromGeoJSON} (Normalized: ${normalizeCountyName(countyNameFromGeoJSON)}) - Is Colored: ${coloredCounties.includes(normalizeCountyName(countyNameFromGeoJSON))}`);
        return coloredCounties.includes(normalizeCountyName(countyNameFromGeoJSON));
    };

    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="container">
                    <a href="/" className="navbar-brand">
                        OS<span className="brand-accent">Forms</span>
                    </a>
                    <ul className="navbar-nav">
                        <li><a href="#features">Features</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="/login" className="btn btn-outline-primary">Login</a></li>
                    </ul>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1>Intelligent Document Archiving for the Modern Institution</h1>
                        <p className="subtitle">
                            Securely manage, rapidly retrieve, and effortlessly preserve your
                            organization's critical documents with our cutting-edge, open-source solution.
                        </p>
                        <div className="hero-ctas">
                            <a href="#features" className="btn btn-primary btn-large">
                                Discover How
                            </a>
                            <a href="https://github.com/your-repo/document-archiving-system" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-large">
                                <FaCodeBranch /> View on GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="features-section">
                {loading && <p>Loading county data from backend...</p>}
                {error && <p className="error-message">{error}</p>}

                <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginTop: '1rem' }}>
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{
                            scale: 4800,
                            center: [25, 46],
                        }}
                        style={{ width: '100%', height: 'auto', backgroundColor: '#f0f0f0' }}
                    >
                        {/* UPDATE THIS LINE: use the URL path to the GeoJSON file in public/ */}
                        <Geographies geography="/romania-counties.geojson">
                            {({ geographies }) => {
                                // console.log('Geographies received from romaniaGeoData:', geographies);
                                if (!geographies || geographies.length === 0) {
                                    console.warn('No geographies found to render. Check /public/romania-counties.geojson content.');
                                    return null;
                                }

                                return geographies.map(geo => {
                                    // console.log('Processing geo feature:', geo);
                                    const countyName = geo.properties?.NAME_1;
                                    
                                    if (!countyName) {
                                        console.warn('Geo feature missing NAME_1 property:', geo);
                                    }

                                    const isColored = isCountyColored(countyName);

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            style={{
                                                default: {
                                                    fill: isColored ? "#4CAF50" : "#D6D6DA",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 0.5,
                                                    outline: "none",
                                                },
                                                hover: {
                                                    fill: isColored ? "#66BB6A" : "#EAEAEC",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 0.5,
                                                    outline: "none",
                                                },
                                                pressed: {
                                                    fill: isColored ? "#388E3C" : "#CDCDD2",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 0.5,
                                                    outline: "none",
                                                },
                                            }}
                                        >
                                            <title>{countyName}</title>
                                        </Geography>
                                    );
                                });
                            }}
                        </Geographies>
                    </ComposableMap>
                    <div style={{ padding: '1rem', background: '#fff', borderTop: '1px solid #eee' }}>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>
                            <span style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: '#4CAF50', marginRight: '5px', verticalAlign: 'middle', borderRadius: '3px' }}></span>
                            Counties with documents
                            <span style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: '#D6D6DA', marginLeft: '15px', marginRight: '5px', verticalAlign: 'middle', borderRadius: '3px' }}></span>
                            Other counties
                        </p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="container">
                    <h2>About Document<span className="brand-accent">Arc</span></h2>
                    <p>
                        OSForms is an innovative, open-source document archiving system crafted
                        to meet the rigorous demands of modern institutions. Leveraging the power
                        of React and Vite, it delivers a high-performance, scalable, and
                        user-friendly platform for effective digital asset management. Our
                        commitment is to provide organizations with a transparent, secure, and
                        cost-efficient pathway to digital preservation.
                    </p>
                    <p>
                        As a community-driven project, OSForms thrives on collective
                        contributions, ensuring continuous innovation and adaptability to the
                        ever-evolving landscape of information management.
                    </p>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to transform your document management?</h2>
                    <a href="https://github.com/your-repo/document-archiving-system" target="_blank" rel="noopener noreferrer" className="btn btn-cta btn-large">
                        Get Started Today
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} OSForms. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="#">Privacy Policy</a>
                        <span className="separator">|</span>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;