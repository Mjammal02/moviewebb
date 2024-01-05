// src/components/MovieList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieList.css';
import DiscoverPage from './DiscoveryPage';

// Lägg till detta i början av din komponent för att importera nödvändiga ikoner från FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';


const MovieList = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  
  const [allMovies, setAllMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [showHome, setShowHome] = useState(true); // Track whether to show the home page or discover page

  const isComputer = window.innerWidth >= 700; //kollar om det är dator, 

  const [showMenu, setShowMenu] = useState(false); // Track whether to show the menu (container-20)
  const menuIcon = showMenu ? faTimes : faBars;

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleDiscoverClick = () => {
    setShowHome(false);
  };

  const handleHomeClick = () => {
    setShowHome(true);
  };

  const handleGenreSelect = async (genreId) => {
    try {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en&sort_by=popularity.desc&with_genres=${genreId}`
      );
      const movies = response.data.results;
      
      // Implement logic to update state or perform any other actions with the fetched movies
      console.log('Movies for genre', genreId, ':', movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  
        // Fetch trending movies
        const trendingResponse = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=en-US&page=1`
        );
        const trendingMoviesData = trendingResponse.data.results.slice(0, 2);
  
        // Fetch now playing movies
        const nowPlayingResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
        );
        const nowPlayingMoviesData = nowPlayingResponse.data.results.slice(0, 5);
  
        // Fetch top-rated movies
        const topRatedResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`
        );
        const topRatedMoviesData = topRatedResponse.data.results.slice(0, 5);
  
        // Combine all movie data
        const allMoviesData = [...topRatedMoviesData, ...nowPlayingMoviesData, ...trendingMoviesData];
  
        // Set all movies
        setAllMovies(allMoviesData);
        setTrendingMovies(trendingMoviesData);
        setNowPlayingMovies(nowPlayingMoviesData);
        setTopRatedMovies(topRatedMoviesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchMovies();
  }, []);

  const filteredMovies = Array.from(new Set(allMovies.filter((movie) =>
  movie.title.toLowerCase().includes(searchQuery.toLowerCase())
).map((movie) => movie.id))).map((id) => allMovies.find((movie) => movie.id === id));



  return (
    isComputer ?
    <div className="MovieList">
      <div className="container-20">
        {/* First container, 20% of the page width */}
        <div className="above-left-container">
          <h4>Movies</h4>
          {/* Content of the first container */}
        </div>
        <div className="lower-left-container">
          <h4 onClick={handleHomeClick}>Home</h4>
          <h4 onClick={handleDiscoverClick}>Discover</h4>
          {/* Another content in the first container */}
        </div>
      </div>
      <div className="container-80">
        {/* Second container, 80% of the page width */}
        {showHome ? (
          // Home Page
          <div className="Search-container">
            <h4>Search</h4>
            <input
              type="text"
              placeholder="Enter your search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.trim() !== '');
              }}
            />
            {showSearchResults ? (
              // Show search results
              <div className="SearchResults-container">
                <h1>Search Results</h1>
                {filteredMovies.map((movie) => (
                  <div className="search" key={movie.id}>
                    <li className="movie-item-search">
                      <img
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                      />
                      <div className="title-container-search">
                        <p>{movie.title}</p>
                      </div>
                    </li>
                  </div>
                ))}
              </div>
            ) : (
              // Show trending, now playing, and top-rated movies
              <>
                <div className="Trending-container">
                  <h1>Trending</h1>
                  <ul>
                    {trendingMovies.map((movie) => (
                      <li key={movie.id} className="movie-item">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                        />
                        <div className="title-container">
                          <p>{movie.title}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="NowPlaying-container">
                  <h1>Now Playing</h1>
                  <ul>
                    {nowPlayingMovies.map((movie) => (
                      <li key={movie.id} className="movie-item">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                        />
                        <div className="title-container">
                          <p>{movie.title}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="TopRated-container">
                  <h1>Top Rated</h1>
                  <ul>
                    {topRatedMovies.map((movie) => (
                      <li key={movie.id} className="movie-item">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                        />
                        <div className="title-container">
                          <p>{movie.title}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        ) : (
          // Discover Page
          <DiscoverPage onSelectGenre={handleGenreSelect} menuIcon={menuIcon} handleMenuClick={handleMenuClick} />
          )}
      </div>
    </div>
    : //Else - sats för mobiler--------------------------------------------------------------------------------------------
    <div className="mobile-App">
<div className={`container-20-mobile ${showMenu ? 'menu-open' : ''}`}>
        {/* First container, 20% of the page width */}
        <div className="above-left-container-mobile">
          <h4>Movies</h4>
          {/* Content of the first container */}
        </div>
        <div className="lower-left-container-mobile">
          <h4 onClick={handleHomeClick}>Home</h4>
          <h4 onClick={handleDiscoverClick}>Discover</h4>
          {/* Another content in the first container */}
        </div>
      </div>
    <div className="container-80-mobile">
    {showHome ? (
    <div className="Search-container-mobile">
  
  <h4>Search</h4> 
  <div className="menu-icon" onClick={handleMenuClick}>
  {/* Use FontAwesomeIcon to display the menu icon */}
  <FontAwesomeIcon icon={menuIcon}/>
</div>
  <input
    type="text"
    placeholder="Enter your search"
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      setShowSearchResults(e.target.value.trim() !== '');
    }}
  />
  {showSearchResults ? (
    // Show search results
    <div className="SearchResults-container-mobile">
      <h1>Search Results</h1>
      {filteredMovies.map((movie) => (
        <div className="search-mobile" key={movie.id}>
          <li className="movie-item-search-mobile">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="title-container-search-mobile">
              <p>{movie.title}</p>
            </div>
          </li>
        </div>
      ))}
    </div>
  ) : (
    // Show trending, now playing, and top-rated movies
    <>
      <div className="Trending-container-mobile">
        <h1>Trending</h1>
        <ul>
          {trendingMovies.map((movie) => (
            <li key={movie.id} className="movie-item-mobile">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="title-container-mobile">
                <p>{movie.title}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="NowPlaying-container-mobile">
        <h1>Now Playing</h1>
        <ul>
          {nowPlayingMovies.map((movie) => (
            <li key={movie.id} className="movie-item-mobile">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="title-container-mobile">
                <p>{movie.title}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="TopRated-container-mobile">
        <h1>Top Rated</h1>
        <ul>
          {topRatedMovies.map((movie) => (
            <li key={movie.id} className="movie-item-mobile">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="title-container-mobile">
                <p>{movie.title}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )}
</div>
 ) : (
  <DiscoverPage onSelectGenre={handleGenreSelect} menuIcon={menuIcon} handleMenuClick={handleMenuClick} />
  )}
</div>
</div>
  );
};

export default MovieList;
