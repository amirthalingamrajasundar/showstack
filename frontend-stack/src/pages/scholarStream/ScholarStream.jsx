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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const PAPERS_PER_PAGE = 6;

  // Mock data for development
  const mockPapers = [
    {
      id: "2103.15538",
      title: "Attention Is All You Need: A Comprehensive Survey of Transformer Architecture",
      authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit"],
      abstract: "The Transformer architecture has revolutionized natural language processing and beyond. This paper provides a comprehensive survey of attention mechanisms and their applications in various domains including computer vision, speech processing, and multimodal learning.",
      categories: ["cs.CL", "cs.LG"],
      submitter: "Ashish Vaswani",
      comments: "Published in NIPS 2017, 15 pages, 16 figures",
      journal_ref: "Advances in Neural Information Processing Systems 30 (2017)",
      doi: "10.1000/182",
      versions: [
        { version: "v1", created: "Mon, 29 Mar 2021 17:58:04 GMT" }
      ]
    },
    {
      id: "2006.11239", 
      title: "GPT-3: Language Models are Few-Shot Learners",
      authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder", "Melanie Subbiah"],
      abstract: "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples.",
      categories: ["cs.CL"],
      submitter: "Tom B. Brown",
      comments: "Published in NeurIPS 2020, 72 pages",
      journal_ref: "Advances in Neural Information Processing Systems 33 (2020)",
      doi: "10.1000/183", 
      versions: [
        { version: "v1", created: "Thu, 22 May 2020 17:50:14 GMT" }
      ]
    },
    {
      id: "1706.03762",
      title: "Attention Is All You Need",
      authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
      abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism.",
      categories: ["cs.CL", "cs.LG"],
      submitter: "Ashish Vaswani",
      comments: "15 pages, 5 figures",
      journal_ref: null,
      doi: null,
      versions: [
        { version: "v1", created: "Mon, 12 Jun 2017 17:57:34 GMT" }
      ]
    },
    {
      id: "2010.11929",
      title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
      authors: ["Alexey Dosovitskiy", "Lucas Beyer", "Alexander Kolesnikov"],
      abstract: "While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. In vision, attention is either applied in conjunction with convolutional networks, or used to replace certain components of convolutional networks while keeping their overall structure intact.",
      categories: ["cs.CV", "cs.AI", "cs.LG"],
      submitter: "Alexey Dosovitskiy",
      comments: "Published at ICLR 2021",
      journal_ref: "International Conference on Learning Representations (2021)",
      doi: "10.1000/184",
      versions: [
        { version: "v1", created: "Thu, 22 Oct 2020 17:58:04 GMT" }
      ]
    },
    {
      id: "1810.04805",
      title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", 
      authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
      abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
      categories: ["cs.CL"],
      submitter: "Jacob Devlin",
      comments: "13 pages",
      journal_ref: "Proceedings of NAACL-HLT 2019",
      doi: "10.1000/185",
      versions: [
        { version: "v1", created: "Fri, 11 Oct 2018 18:33:37 GMT" }
      ]
    },
    {
      id: "2005.14165",
      title: "Language Models are Few-Shot Learners",
      authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder"],
      abstract: "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets.",
      categories: ["cs.CL", "cs.AI"],
      submitter: "Tom B. Brown", 
      comments: "72 pages, 16 figures",
      journal_ref: null,
      doi: null,
      versions: [
        { version: "v1", created: "Thu, 28 May 2020 17:50:14 GMT" }
      ]
    }
  ];

  // Load initial papers
  useEffect(() => {
    loadInitialPapers();
  }, []);

  const loadInitialPapers = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${SCHOLAR_STREAM_API_URL}${SCHOLAR_STREAM_ENDPOINTS.SEARCH}?page=1&limit=${PAPERS_PER_PAGE}`);
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        setPapers(mockPapers);
        setTotalResults(mockPapers.length);
        setTotalPages(Math.ceil(mockPapers.length / PAPERS_PER_PAGE));
        setLoading(false);
        setIsSearchMode(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading papers:', error);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setCurrentPage(1);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${SCHOLAR_STREAM_API_URL}${SCHOLAR_STREAM_ENDPOINTS.SEARCH}?q=${encodeURIComponent(searchQuery)}&model=${selectedModel}&page=1&limit=${PAPERS_PER_PAGE}`);
      // const data = await response.json();
      
      // Mock search functionality
      const filteredPapers = mockPapers.filter(paper => 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setTimeout(() => {
        setPapers(filteredPapers);
        setTotalResults(filteredPapers.length);
        setTotalPages(Math.ceil(filteredPapers.length / PAPERS_PER_PAGE));
        setLoading(false);
        setIsSearchMode(true);
      }, 1500);
    } catch (error) {
      console.error('Error searching papers:', error);
      setLoading(false);
    }
  };

  const loadRecommendations = async (paperId) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${SCHOLAR_STREAM_API_URL}${SCHOLAR_STREAM_ENDPOINTS.RECOMMENDATIONS}?paper_id=${paperId}&model=${selectedModel}&limit=5`);
      // const data = await response.json();
      
      // Mock recommendations - return different papers excluding the current one
      const availablePapers = mockPapers.filter(paper => paper.id !== paperId);
      const shuffled = availablePapers.sort(() => 0.5 - Math.random());
      const mockRecommendations = shuffled.slice(0, 3);
      
      setTimeout(() => {
        setRecommendations(mockRecommendations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setLoading(false);
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
    setCurrentPage(page);
    // In a real app, you would make an API call here to load the specific page
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
          <span className="paper-category">{formatCategory(paper.categories)}</span>
        </div>
      </div>
      <p className="paper-abstract">{paper.abstract}</p>
    </div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  const renderPapersList = () => (
    <>
      {renderSearchSection()}
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading papers...</p>
        </div>
      ) : (
        <>
          <div className="papers-section">
            <h2 className="section-title">
              Research Papers
            </h2>
            
            {papers.length > 0 ? (
              <div className="papers-grid">
                {papers.slice((currentPage - 1) * PAPERS_PER_PAGE, currentPage * PAPERS_PER_PAGE).map(renderPaperCard)}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">📝</div>
                <p>{isSearchMode ? 'No papers found for your search.' : 'No papers available.'}</p>
              </div>
            )}
            
            {renderPagination()}
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
              href={`https://arxiv.org/abs/${selectedPaper.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="paper-link"
            >
              View on ArXiv
            </a>
            <a 
              href={`https://arxiv.org/pdf/${selectedPaper.id}`} 
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
            Recommended Papers (using {selectedModel.replace('_', ' ').toUpperCase()})
          </h3>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading recommendations...</p>
            </div>
          ) : (
            <div className="papers-grid">
              {recommendations.map(renderPaperCard)}
            </div>
          )}
        </div>
      </>
    );
  }
};

export default ScholarStream;