import { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  AppBar,
  Toolbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { INDIC_COMMERCE_API_URL } from '../../constants';
import './ProductsPage.css';

// WhatsApp Icon SVG component
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', marginRight: '8px' }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Styled components
const StyledSearchSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
}));

const SearchForm = styled('form')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
  },
}));

const ProductImageContainer = styled(Box)(({ theme }) => ({
  height: 200,
  overflow: 'hidden',
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const NoResults = styled(Paper)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  margin: `${theme.spacing(6)} 0`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
}));

const WhatsAppFloat = styled(Button)(({ theme }) => ({
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
    backgroundColor: 'var(--primary)',
  },
}));

const ProductsPage = () => {
  const [config, setConfig] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch configuration data and all products only once
    fetch(`${INDIC_COMMERCE_API_URL}/get_config`)
      .then((response) => response.json())
      .then((data) => {
        setConfig(data.config);
        setAllProducts(data.config.products || []);
        setFilteredProducts(data.config.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching config:", error);
        setLoading(false);
      });
  }, []);

  // Filter products locally based on search query and category
  useEffect(() => {
    if (!allProducts.length) return;
    
    setLoading(true);
    
    // Apply filters to the products
    const filtered = allProducts.filter(product => {
      // Search query filter - check if any product field contains the search query
      const matchesSearch = !searchQuery || 
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category filter
      const matchesCategory = !category || (product.category && product.category.toLowerCase() === category.toLowerCase());
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredProducts(filtered);
    setLoading(false);
  }, [searchQuery, category, allProducts]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // No need to do anything here as filtering is handled in the useEffect
  };

  return (
    <div className="products-page">
      <AppBar position="static" sx={{ 
        background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
      }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/indic-commerce"
            sx={{ 
              flexGrow: 1, 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '2rem',
            }}
          >
            IndicCommerce
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/indic-commerce">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/indic-commerce/products" sx={{ fontWeight: 'bold' }}>
              Products
            </Button>
            {config && (
              <Button 
                color="inherit" 
                href={`https://wa.me/${config.whatsapp_number}?text=${config.join_code}`}
              >
                WhatsApp
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <StyledSearchSection>
          <SearchForm onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
            />
            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="apparel">Apparel</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="footwear">Footwear</MenuItem>
              </Select>
            </FormControl>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                backgroundColor: 'var(--primary)',
                '&:hover': {
                  backgroundColor: 'var(--secondary)',
                }
              }}
            >
              Search
            </Button>
          </SearchForm>
        </StyledSearchSection>        {loading ? (
          <Typography variant="h6" align="center" sx={{ marginY: 4 }}>
            Loading products...
          </Typography>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <Grid container spacing={3} sx={{ marginBottom: 6 }}>
            {filteredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ProductCard>
                  <ProductImageContainer>
                    <ProductImage
                      component="img"
                      image={product.image_url || '/static/products/placeholder.jpg'}
                      alt={product.name}
                    />
                  </ProductImageContainer>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="caption" sx={{ 
                      textTransform: 'uppercase', 
                      color: '#666', 
                      letterSpacing: 1, 
                      marginBottom: 0.5 
                    }}>
                      {product.category || 'Uncategorized'}
                    </Typography>
                    <Typography variant="h6" component="h3" sx={{ 
                      fontWeight: 600, 
                      marginBottom: 1,
                      color: 'var(--dark)'
                    }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#666',
                      marginBottom: 1.5,
                      flexGrow: 1
                    }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--secondary)' }}>
                      {product.price}
                    </Typography>
                  </CardContent>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <NoResults>
            <Typography variant="h5" component="h3" sx={{ color: 'var(--dark)', marginBottom: 2 }}>
              No products found
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 3 }}>
              Try different search terms or browse all products
            </Typography>            <Button 
              variant="contained" 
              onClick={() => { 
                setSearchQuery(''); 
                setCategory(''); 
                setFilteredProducts(allProducts);
              }}
              sx={{
                backgroundColor: 'var(--primary)',
                '&:hover': {
                  backgroundColor: 'var(--secondary)',
                }
              }}
            >
              View All Products
            </Button>
          </NoResults>
        )}
      </Container>
      
      <Box sx={{ 
        backgroundColor: 'var(--dark)', 
        color: 'white', 
        padding: '40px 0 20px', 
        textAlign: 'center',
        marginTop: 6
      }}>
        <Container maxWidth="lg">
          <Typography variant="h5" component="h3" sx={{ marginBottom: 2 }}>
            IndicCommerce
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: '20px', 
            margin: '20px 0', 
            flexWrap: 'wrap', 
            justifyContent: 'center' 
          }}>
            <Typography component={Link} to="#" sx={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              About Us
            </Typography>
            <Typography component={Link} to="#" sx={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Privacy Policy
            </Typography>
            <Typography component={Link} to="#" sx={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Terms of Service
            </Typography>
            <Typography component={Link} to="#" sx={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Contact
            </Typography>
          </Box>
          <Typography sx={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.7 }}>
            © 2025 IndicCommerce. All Rights Reserved.
          </Typography>
        </Container>
      </Box>

      {config && (
        <WhatsAppFloat 
          href={`https://wa.me/${config.whatsapp_number}?text=Hi! I'm browsing the products on IndicCommerce. Can you help me find what I'm looking for?`}
          startIcon={<WhatsAppIcon />}
          variant="contained" 
          className="bounce"
        >
          Chat Now
        </WhatsAppFloat>
      )}
    </div>
  );
};

export default ProductsPage;
