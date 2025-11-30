import React, { useState, useEffect } from 'react';
import { SCHOLAR_STREAM_API_URL, SCHOLAR_STREAM_ENDPOINTS, RECOMMENDATION_MODELS } from '../../constants';
import './ScholarStream.css';

const ScholarStream = () => {
  // State management
  const [papers, setPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState(RECOMMENDATION_MODELS.TFIDF);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [error, setError] = useState(null);

  const PAPERS_PER_PAGE = 6;

  // Load initial papers when component mounts or model changes
  useEffect(() => {
    // Don't load initial papers - wait for user to search
    setPapers([]);
    setIsSearchMode(false);
  }, []);

  // Reload search when model changes and we're in search mode
  useEffect(() => {
    if (isSearchMode && searchQuery.trim()) {
      performSearch(searchQuery, 1);
    }
  }, [selectedModel]);

  const performSearch = async (query, page) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        q: query,
        model: selectedModel,
        page: String(page),
        limit: String(PAPERS_PER_PAGE)
      });
      
      const response = await fetch(`${SCHOLAR_STREAM_API_URL}${SCHOLAR_STREAM_ENDPOINTS.SEARCH}?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setPapers(result.data.papers);
        setTotalResults(result.data.pagination.total_results);
        setTotalPages(result.data.pagination.total_pages);
        setCurrentPage(result.data.pagination.current_page);
        setHasNext(result.data.pagination.has_next);
        setHasPrevious(result.data.pagination.has_previous);
        setIsSearchMode(true);
      } else {
        setError(result.error?.message || 'Search failed');
        setPapers([]);
      }
    } catch (err) {
      console.error('Error searching papers:', err);
      setError('Network error. Please check if the API is running.');
      setPapers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    performSearch(searchQuery, 1);
  };

  const loadRecommendations = async (paperId) => {
    setRecommendationsLoading(true);
    try {
      const params = new URLSearchParams({
        paper_id: paperId,
        model: selectedModel,
        limit: '3'
      });
      
      const response = await fetch(`${SCHOLAR_STREAM_API_URL}${SCHOLAR_STREAM_ENDPOINTS.RECOMMENDATIONS}?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setRecommendations(result.data.recommendations);
      } else {
        console.error('Error loading recommendations:', result.error?.message);
        setRecommendations([]);
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setRecommendations([]);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
    loadRecommendations(paper.id);
  };

  const handleBackToList = () => {
    setSelectedPaper(null);
    setRecommendations([]);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      performSearch(searchQuery, page);
    }
  };

  const formatSimilarityScore = (score) => {
    if (score === null || score === undefined) return null;
    return `${Math.round(score * 100)}%`;
  };

  const truncateAbstract = (abstract, maxLength = 200) => {
    if (!abstract) return '';
    if (abstract.length <= maxLength) return abstract;
    return abstract.substring(0, maxLength).trim() + '...';
  };

  const getCategoryIcon = (categories) => {
    const category = categories[0];
    if (category.startsWith('cs.')) return '💻';
    if (category.startsWith('math.')) return '🔢';
    if (category.startsWith('physics.')) return '⚛️';
    if (category.startsWith('q-bio.')) return '🧬';
    return '📄';
  };

  const getCategoryClass = (categories) => {
    const category = categories[0];
    if (category.startsWith('cs.')) return 'category-cs';
    if (category.startsWith('math.')) return 'category-math'; 
    if (category.startsWith('physics.')) return 'category-physics';
    if (category.startsWith('q-bio.')) return 'category-biology';
    return 'category-default';
  };

  const formatAuthors = (authors) => {
    if (authors.length <= 3) return authors.join(', ');
    return `${authors.slice(0, 3).join(', ')} et al.`;
  };

  const formatCategory = (categories) => {
    return categories[0].replace(/^([^.]+)\./, '$1/');
  };

  // Render functions
  const renderNavbar = () => (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="#" className="navbar-brand" onClick={(e) => { e.preventDefault(); handleBackToList(); }}>
          ScholarStream
        </a>
        <select
          className="navbar-model-selector"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          title="Select recommendation model"
        >
          <option value={RECOMMENDATION_MODELS.TFIDF}>TF-IDF Model</option>
          <option value={RECOMMENDATION_MODELS.BASE_TRANSFORMER}>Base Transformer</option>
          <option value={RECOMMENDATION_MODELS.FINE_TUNED_TRANSFORMER}>Fine-tuned Transformer</option>
        </select>
      </div>

      <div className="navbar-right">
        <a 
          href="https://github.com/amirthalingamrajasundar/research-paper-recommendation-service" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
          title="View GitHub Repository"
        >
          <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </div>
    </nav>
  );

  const renderSearchSection = () => (
    <div className="search-section">
      <form onSubmit={handleSearch}>
        <div className="search-controls">
          <input
            type="text"
            className="search-input"
            placeholder="AI powered research paper search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderPaperCard = (paper) => (
    <div key={paper.id} className="paper-card" onClick={() => handlePaperClick(paper)}>
      <div className="paper-header">
        <div className={`category-icon ${getCategoryClass(paper.categories)}`}>
          {getCategoryIcon(paper.categories)}
        </div>
        <div className="paper-meta">
          <h3 className="paper-title">{paper.title}</h3>
          <p className="paper-authors">{formatAuthors(paper.authors)}</p>
          <div className="paper-meta-footer">
            <span className="paper-category">{formatCategory(paper.categories)}</span>
            {paper.similarity_score !== null && paper.similarity_score !== undefined && (
              <span className="paper-similarity">Match: {formatSimilarityScore(paper.similarity_score)}</span>
            )}
          </div>
        </div>
      </div>
      <p className="paper-abstract">{truncateAbstract(paper.abstract)}</p>
    </div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // Show limited page numbers for better UX
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };

    return (
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevious || loading}
        >
          Previous
        </button>
        {getPageNumbers().map(page => (
          <button
            key={page}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
            disabled={loading}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNext || loading}
        >
          Next
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages} ({totalResults} results)
        </span>
      </div>
    );
  };

  const renderPapersList = () => (
    <>
      {renderSearchSection()}
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Searching papers...</p>
        </div>
      ) : (
        <>
          <div className="papers-section">
            {isSearchMode && (
              <h2 className="section-title">
                Search Results {totalResults > 0 && `(${totalResults} papers found)`}
              </h2>
            )}
            
            {papers.length > 0 ? (
              <div className="papers-grid">
                {papers.map(renderPaperCard)}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p>{isSearchMode ? 'No papers found for your search. Try different keywords.' : 'Enter a search query to find research papers.'}</p>
              </div>
            )}
            
            {papers.length > 0 && renderPagination()}
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="scholar-stream-container">
      {renderNavbar()}
      
      <div className="main-content">
        {!selectedPaper && (
          <div className="landing-section">
            <p className="service-description">
              ScholarStream demonstrates the performance of TF-IDF, sentence transformers, and fine-tuned sentence transformers for research paper recommendation.
            </p>
          </div>
        )}
        
        {selectedPaper ? renderPaperDetails() : renderPapersList()}
      </div>
    </div>
  );

  function renderPaperDetails() {
    return (
      <>
        <div className="paper-details">
          <button className="back-button" onClick={handleBackToList}>
            ← Back to Results
          </button>
          
          <div className="paper-details-header">
            <div className={`category-icon ${getCategoryClass(selectedPaper.categories)}`}>
              {getCategoryIcon(selectedPaper.categories)}
            </div>
            <div className="paper-details-meta">
              <h1 className="paper-details-title">{selectedPaper.title}</h1>
              <p className="paper-details-authors">{selectedPaper.authors.join(', ')}</p>
            </div>
          </div>
          
          <div className="paper-details-info">
            <div className="info-item">
              <div className="info-label">ArXiv ID</div>
              <div className="info-value">{selectedPaper.id}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Categories</div>
              <div className="info-value">{selectedPaper.categories.join(', ')}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Submitter</div>
              <div className="info-value">{selectedPaper.submitter}</div>
            </div>
            {selectedPaper.journal_ref && (
              <div className="info-item">
                <div className="info-label">Journal</div>
                <div className="info-value">{selectedPaper.journal_ref}</div>
              </div>
            )}
            {selectedPaper.doi && (
              <div className="info-item">
                <div className="info-label">DOI</div>
                <div className="info-value">{selectedPaper.doi}</div>
              </div>
            )}
            {selectedPaper.comments && (
              <div className="info-item">
                <div className="info-label">Comments</div>
                <div className="info-value">{selectedPaper.comments}</div>
              </div>
            )}
          </div>
          
          <div className="paper-abstract-full">
            <h3 className="abstract-title">Abstract</h3>
            <p className="abstract-content">{selectedPaper.abstract}</p>
          </div>
          
          <div className="paper-links">
            <a 
              href={selectedPaper.arxiv_url || `https://arxiv.org/abs/${selectedPaper.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="paper-link"
            >
              View on ArXiv
            </a>
            <a 
              href={selectedPaper.pdf_url || `https://arxiv.org/pdf/${selectedPaper.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="paper-link"
            >
              Download PDF
            </a>
          </div>
        </div>
        
        <div className="recommendations-section">
          <h3 className="recommendations-title">
            Recommended Papers (using {selectedModel.replace(/_/g, ' ').toUpperCase()})
          </h3>
          
          {recommendationsLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading recommendations...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="papers-grid">
              {recommendations.map(renderPaperCard)}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📚</div>
              <p>No recommendations available for this paper.</p>
            </div>
          )}
        </div>
      </>
    );
  }
};

export default ScholarStream;