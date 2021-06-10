import { useState, useEffect } from 'react';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import Loader from '../../components/Loader';
import Status from '../../components/Status';
import noResultsFound from '../../images/no_results_found.jpg';
import SearchForm from '../../components/SearchForm';
import MoviesList from '../../components/MoviesList';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function MoviesPage() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const [movieQuery, setMovieQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);

    const { url } = useRouteMatch();
    const history = useHistory();
    const location = useLocation();

    const searchMovie = new URLSearchParams(location.search).get('query') ?? '';

    const handleMovieQueryChange = ({ target }) => {
        setMovieQuery(target.value.toLowerCase());
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (movieQuery.trim() === '') {
            return toast.warning('Please, write some request');
        }

        history.push({ ...location, search: `query=${movieQuery}` });

        setMovies([]);
        setPage(1);

        // По превью дз запрос удаляется!!!
        // setMovieQuery('');
    };

    useEffect(() => {
        if (searchMovie === '') {
            return;
        }

        setStatus(Status.PENDING);
        fetchMovies();
    }, [searchMovie]);

    const fetchMovies = () => {
        console.log('page in fetchMovies:', page);
        theMovieDbAPI
            .fetchMovieByName(searchMovie, page)
            .then(({ results }) => {
                if (results.length === 0) {
                    setStatus(Status.IDLE);
                    return;
                }

                setMovies(state => [...state, ...results]);
                setStatus(Status.RESOLVED);
                updatePage();
            })
            .catch(error => {
                setError(error);
                setStatus(Status.REJECTED);
            });
    };

    const updatePage = () => {
        setPage(state => state + 1);
    };

    return (
        <>
            <SearchForm
                onSubmit={handleSubmit}
                movieQuery={movieQuery}
                onChange={handleMovieQueryChange}
            />

            {status === Status.IDLE && (
                <img src={noResultsFound} alt="No results found" />
            )}

            {status === Status.PENDING && <Loader />}

            {status === Status.RESOLVED && (
                <InfiniteScroll
                    dataLength={movies.length}
                    next={fetchMovies}
                    hasMore={true}
                    loader={<Loader />}
                >
                    <MoviesList
                        movies={movies}
                        basicUrl={`${url}/`}
                        location={location}
                        label={`GO BACK to Search <${searchMovie}>`}
                    />
                </InfiniteScroll>
            )}

            {status === Status.REJECTED && <p>{error.message}</p>}
        </>
    );
}
