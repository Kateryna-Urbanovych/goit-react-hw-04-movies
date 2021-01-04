import { useState, useEffect } from 'react';
import { Link, useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import MakeSlug from '../../components/Slug';
import Loader from '../../components/Loader';
import Status from '../../components/Status';
import noResultsFound from '../../images/no_results_found.jpg';

export default function MoviesPage() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const [movieQuery, setMovieQuery] = useState('');
    const [movies, setMovies] = useState(null);

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

        // По превью дз запрос удаляется!!!
        setMovieQuery('');
    };

    useEffect(() => {
        if (searchMovie === '') {
            return;
        }

        setStatus(Status.PENDING);

        theMovieDbAPI
            .fetchMovieByName(searchMovie)
            .then(({ results }) => {
                if (results.length === 0) {
                    setStatus(Status.IDLE);
                    return;
                }

                setMovies(results);
                setStatus(Status.RESOLVED);
            })
            .catch(error => {
                setError(error);
                setStatus(Status.REJECTED);
            });
    }, [searchMovie]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search movies"
                    value={movieQuery}
                    onChange={handleMovieQueryChange}
                />
                <button type="submit">Search</button>
            </form>

            {status === Status.IDLE && (
                <img src={noResultsFound} alt="No results found" />
            )}

            {status === Status.PENDING && <Loader />}

            {status === Status.RESOLVED && (
                <>
                    {movies.map(({ id, title }) => (
                        <ul>
                            <li key={id}>
                                <Link
                                    to={{
                                        pathname: `${url}/${MakeSlug(
                                            `${title} ${id}`,
                                        )}`,
                                        state: {
                                            from: {
                                                location,
                                                label: `GO BACK to Search <${searchMovie}>`,
                                            },
                                        },
                                    }}
                                >
                                    {title}
                                </Link>
                            </li>
                        </ul>
                    ))}
                </>
            )}

            {status === Status.REJECTED && <p>{error.message}</p>}
        </>
    );
}
