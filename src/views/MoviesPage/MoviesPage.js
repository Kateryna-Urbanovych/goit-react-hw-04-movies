import { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import * as theMovieDbAPI from '../../servises/themoviedb-api';

export default function MoviesPage() {
    const [movieQuery, setMovieQuery] = useState('');
    const [movies, setMovies] = useState(null);

    const { url } = useRouteMatch();
    // console.log(url);

    const handleMovieQueryChange = ({ target }) => {
        // console.log(target.value);
        setMovieQuery(target.value.toLowerCase());
    };

    const handleSubmit = event => {
        event.preventDefault();

        // По превью дз запрос удаляется!!!
        setMovieQuery('');

        if (movieQuery.trim() === '') {
            return window.alert('Please, write some request');
            // return toast.info('Please, write some request');
        }

        theMovieDbAPI
            .fetchMovieByName(movieQuery)
            .then(({ results }) => setMovies(results));
    };

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
                            <Link to={`${url}/${id}`}>{title}</Link>
                        </li>
                    </ul>
                ))}
        </>
    );
}
