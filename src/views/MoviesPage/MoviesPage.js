import { useState, useEffect } from 'react';
import { Link, useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import * as theMovieDbAPI from '../../servises/themoviedb-api';

export default function MoviesPage() {
    const [movieQuery, setMovieQuery] = useState('');
    const [movies, setMovies] = useState(null);

    const { url } = useRouteMatch();
    // console.log(url);

    const history = useHistory();
    const location = useLocation();
    const searchMovie = new URLSearchParams(location.search).get('query') ?? '';

    const handleMovieQueryChange = ({ target }) => {
        setMovieQuery(target.value.toLowerCase());
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (movieQuery.trim() === '') {
            return window.alert('Please, write some request');
            // return toast.info('Please, write some request');
        }

        history.push({ ...location, search: `query=${movieQuery}` });

        // По превью дз запрос удаляется!!!
        setMovieQuery('');
    };

    useEffect(() => {
        if (searchMovie === '') {
            return;
        }

        theMovieDbAPI
            .fetchMovieByName(searchMovie)
            .then(({ results }) => setMovies(results));
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

            {movies &&
                movies.map(({ id, title }) => (
                    <ul>
                        <li key={id}>
                            <Link
                                to={{
                                    pathname: `${url}/${id}`,
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
    );
}
