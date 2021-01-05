import PropTypes from 'prop-types';

const KEY = 'a85528c240511b0034c4cacb863ca798';
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchWithErrorHandling(url = '') {
    const response = await fetch(url);
    return response.ok
        ? await response.json()
        : Promise.reject(new Error('Not found'));
}

export function fetchTrendingMovies() {
    return fetchWithErrorHandling(
        `${BASE_URL}/trending/movie/day?api_key=${KEY}`,
    );
}

export function fetchMovieById(movieId) {
    return fetchWithErrorHandling(
        `${BASE_URL}/movie/${movieId}?api_key=${KEY}&language=en-US`,
    );
}

export function fetchMovieByName(movieQuery) {
    return fetchWithErrorHandling(
        `${BASE_URL}/search/movie?api_key=${KEY}&language=en-US&query=${movieQuery}&page=1&include_adult=false`,
    );
}

export function fetchMovieCast(movieId) {
    return fetchWithErrorHandling(
        `${BASE_URL}/movie/${movieId}/credits?api_key=${KEY}&language=en-US`,
    );
}

export function fetchMovieReviews(movieId) {
    return fetchWithErrorHandling(
        `${BASE_URL}/movie/${movieId}/reviews?api_key=${KEY}&language=en-US&page=1`,
    );
}

const theMovieDbAPI = {
    fetchTrendingMovies,
    fetchMovieById,
    fetchMovieByName,
    fetchMovieCast,
    fetchMovieReviews,
};

theMovieDbAPI.propTypes = {
    url: PropTypes.string.isRequired,
    movieId: PropTypes.string.isRequired,
    movieQuery: PropTypes.string.isRequired,
};
