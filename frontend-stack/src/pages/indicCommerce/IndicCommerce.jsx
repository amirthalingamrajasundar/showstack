import { useEffect, useState } from 'react';
import { 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Box,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import { INDIC_COMMERCE_API_URL } from '../../constants';
import './IndicCommerce.css';

// SVG Icons as React components
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', marginRight: '8px' }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', marginRight: '8px' }}>
    <path d="M17 18c-1.11 0-2 .89-2 2 0 1.097.903 2 2 2 1.097 0 2-.903 2-2 0-1.11-.903-2-2-2M1 2v2h2l3.6 7.59-1.36 2.45c-.15.28-.24.58-.24.91 0 1.11.89 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25 0-.05.01-.08.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5 0-.55-.45-1-1-1H5.21l-.94-2M7 18c-1.11 0-2 .89-2 2 0 1.097.903 2 2 2 1.097 0 2-.903 2-2 0-1.11-.903-2-2-2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '40px', height: '40px' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '40px', height: '40px' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  </svg>
);

const RecommendationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '40px', height: '40px' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11a4 4 0 11-8 0 4 4 0 018 0zm-4-8a8 8 0 00-7.93 6.76c-.04.276-.05.552-.05.83 0 1.215.318 2.357.886 3.347A8.972 8.972 0 018 16a8.967 8.967 0 01-1.65-2.844c-.114-.255-.213-.516-.294-.78A8 8 0 1012 3z" />
  </svg>
);

const IndicCommerce = () => {
  const [config, setConfig] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch configuration data
    setLoading(true);
    fetch(`${INDIC_COMMERCE_API_URL}/get_config`)
      .then((response) => response.json())
      .then((data) => {
        setConfig(data.config);
        setProducts(data.config.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching configuration:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch products based on search query
    // Only fetch if we're not in initial loading state
    if (!loading && searchQuery) {
      setLoading(true);
      const fetchProducts = async () => {
        try {
          const response = await fetch(`${INDIC_COMMERCE_API_URL}/get_products?query=${searchQuery}`);
          const data = await response.json();
          setProducts(data.products || []);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching products:", error);
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="indic-commerce">      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <Typography variant="h6" sx={{ mt: 2, color: 'var(--secondary)' }}>
            Loading...
          </Typography>
        </div>
      )}
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
          padding: '60px 0 120px',
          position: 'relative',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, marginBottom: 2, textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
              IndicCommerce
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 300, marginBottom: 4 }}>
              Your Voice-Powered Shopping Assistant in Regional Languages
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', marginTop: 3 }}>              {config && (
                <Button 
                  variant="contained" 
                  size="large"
                  href={`https://wa.me/${config.whatsapp_number}?text=join ${config.join_code}`}
                  startIcon={<WhatsAppIcon />}
                  sx={{ 
                    borderRadius: '50px', 
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    color: 'var(--secondary)',
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 7px 14px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  Chat on WhatsApp
                </Button>
              )}              <Button 
                variant="contained" 
                size="large"
                component={Link}
                to="/indic-commerce/products"
                startIcon={<CartIcon />}
                sx={{ 
                  borderRadius: '50px', 
                  padding: '12px 24px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 7px 14px rgba(0,0,0,0.1)'
                  }
                }}
              >
                Browse Products
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ marginTop: '-60px', position: 'relative', zIndex: 2, paddingBottom: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: '16px', 
              padding: 3, 
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
              height: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px)'
              }
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: 80, 
                  width: 80, 
                  backgroundColor: 'var(--light)', 
                  borderRadius: '50%', 
                  marginBottom: 2,
                  color: 'var(--primary)'
                }}>
                  <PhoneIcon />
                </Box>
                <Typography variant="h5" component="h3" sx={{ marginBottom: 1.5, color: 'var(--secondary)', fontWeight: 600 }}>
                  Voice Shopping
                </Typography>
                <Typography>
                  Shop using your voice in your preferred language - Tamil, Hindi, Telugu and many more!
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: '16px', 
              padding: 3, 
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
              height: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px)'
              }
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: 80, 
                  width: 80, 
                  backgroundColor: 'var(--light)', 
                  borderRadius: '50%', 
                  marginBottom: 2,
                  color: 'var(--primary)'
                }}>
                  <ChatIcon />
                </Box>
                <Typography variant="h5" component="h3" sx={{ marginBottom: 1.5, color: 'var(--secondary)', fontWeight: 600 }}>
                  Multilingual Support
                </Typography>
                <Typography>
                  Our AI assistant understands and responds in your regional language, making shopping more accessible.
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: '16px', 
              padding: 3, 
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
              height: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px)'
              }
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: 80, 
                  width: 80, 
                  backgroundColor: 'var(--light)', 
                  borderRadius: '50%', 
                  marginBottom: 2,
                  color: 'var(--primary)'
                }}>
                  <RecommendationIcon />
                </Box>
                <Typography variant="h5" component="h3" sx={{ marginBottom: 1.5, color: 'var(--secondary)', fontWeight: 600 }}>
                  Smart Recommendations
                </Typography>
                <Typography>
                  Get personalized product recommendations based on your preferences and shopping history.
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ backgroundColor: 'white', padding: '80px 0' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" sx={{ 
            marginBottom: 6, 
            color: 'var(--dark)', 
            textAlign: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              backgroundColor: 'var(--primary)',
              margin: '20px auto 0',
              borderRadius: '2px'
            }
          }}>
            How It Works
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ padding: 2, textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  fontWeight: 'bold',
                  marginBottom: 1.5
                }}>
                  1
                </Box>
                <Typography variant="h6" component="h3">Connect on WhatsApp</Typography>
                <Typography>
                  {config ? `Send "join ${config.join_code}" to our WhatsApp number` : 'Send the join code to our WhatsApp number'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ padding: 2, textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  fontWeight: 'bold',
                  marginBottom: 1.5
                }}>
                  2
                </Box>
                <Typography variant="h6" component="h3">Send a Voice Message</Typography>
                <Typography>Record your product request in any Indian language</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ padding: 2, textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  fontWeight: 'bold',
                  marginBottom: 1.5
                }}>
                  3
                </Box>
                <Typography variant="h6" component="h3">Get Recommendations</Typography>
                <Typography>Receive personalized product recommendations in your language</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* System Architecture Section */}
      <Box sx={{ padding: '80px 0', backgroundColor: 'var(--bg)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" sx={{ 
            marginBottom: 6, 
            color: 'var(--dark)', 
            textAlign: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              backgroundColor: 'var(--primary)',
              margin: '20px auto 0',
              borderRadius: '2px'
            }
          }}>
            System Architecture
          </Typography>
          
          <Box sx={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
            borderRadius: '12px', 
            overflow: 'hidden',
            backgroundColor: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <img 
              src="/indic_commerce_arch.png" 
              alt="IndicCommerce System Architecture Diagram" 
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center', 
              marginTop: 4, 
              color: 'var(--text)',
              maxWidth: '700px',
              margin: '32px auto 0',
              lineHeight: 1.8
            }}
          >
            Our robust architecture seamlessly integrates voice recognition, natural language processing, 
            and multilingual support to deliver personalized shopping experiences through WhatsApp.
          </Typography>
        </Container>
      </Box>

      {/* Featured Products */}
      <Box sx={{ padding: '80px 0', backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" sx={{ 
            marginBottom: 6, 
            color: 'var(--dark)', 
            textAlign: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              backgroundColor: 'var(--primary)',
              margin: '20px auto 0',
              borderRadius: '2px'
            }
          }}>
            Featured Products
          </Typography>

          <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
            <Button 
              variant="contained"
              component={Link}
              to="/indic-commerce/products"
              sx={{ 
                backgroundColor: 'var(--accent)',
                borderRadius: '4px',
                display: 'inline-block',
                margin: '0 auto'
              }}
            >
              View All Products
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {products && products.slice(0, 4).map((product, index) => (              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image_url || '/static/products/placeholder.jpg'}
                    alt={product.name}
                    sx={{
                      width: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, marginBottom: 0.5 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1.5 }}>
                      {product.description}
                    </Typography>                    <Typography variant="h6" sx={{ color: 'var(--secondary)', fontWeight: 700 }}>
                        {product.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Demo screenshot Section */}
      <Box sx={{ padding: '80px 0', backgroundColor: 'var(--light)' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" sx={{ 
            marginBottom: 4, 
            color: 'var(--dark)', 
            textAlign: 'center'
          }}>
            See IndicCommerce in Action
          </Typography>
          <Box sx={{ 
            maxWidth: '800px', 
            margin: '0 auto', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)', 
            borderRadius: '8px', 
            overflow: 'hidden',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
            }
          }}>
            <img 
              src="/indic_commerce.png" 
              alt="IndicCommerce Demo Screenshot" 
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: 'var(--dark)', color: 'white', padding: '60px 0 30px', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h5" component="h3" sx={{ marginBottom: 2 }}>IndicCommerce</Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: '20px', 
            margin: '20px 0', 
            flexWrap: 'wrap', 
            justifyContent: 'center' 
          }}>
            <Typography component="a" href="#" sx={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              About Us
            </Typography>
            <Typography component="a" href="#" sx={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Privacy Policy
            </Typography>
            <Typography component="a" href="#" sx={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Terms of Service
            </Typography>
            <Typography component="a" href="https://github.com/amirthalingamrajasundar/IndicCommerce" target="_blank" rel="noopener noreferrer" sx={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              GitHub
            </Typography>
            <Typography component="a" href="#" sx={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Contact
            </Typography>
          </Box>
          <Typography sx={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.7 }}>
            © 2025 IndicCommerce. All Rights Reserved.
          </Typography>
        </Container>
      </Box>      {/* WhatsApp Float Button */}
      {config && (
        <Button 
          href={`https://wa.me/${config.whatsapp_number}?text=join ${config.join_code}`}
          startIcon={<WhatsAppIcon />}
          variant="contained" 
          className="bounce"
          sx={{ 
            position: 'fixed', 
            bottom: '30px', 
            right: '30px', 
            backgroundColor: 'var(--primary)', 
            color: 'white', 
            borderRadius: '50px', 
            padding: '12px 24px', 
            fontWeight: 600, 
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.5)', 
            zIndex: 1000, 
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)', 
              boxShadow: '0 8px 25px rgba(37, 211, 102, 0.6)', 
              backgroundColor: 'var(--primary)'
            } 
          }}
        >
          Chat Now
        </Button>
      )}
    </div>
  );
};

export default IndicCommerce;
