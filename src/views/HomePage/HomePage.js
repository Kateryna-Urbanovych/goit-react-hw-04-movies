import { useState, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import * as theMovieDbAPI from '../../servises/themoviedb-api';

export default function HomePage() {
    const { url } = useRouteMatch();
    // console.log(url);
    const [trendingMovies, setTrendingMovies] = useState(null);

    useEffect(() => {
        theMovieDbAPI
            .fetchTrendingMovies()
            .then(({ results }) => setTrendingMovies(results));
    }, []);

    // console.log(trendingMovies);

    return (
        <>
            <h2>Trending today</h2>
            {trendingMovies &&
                trendingMovies.map(({ id, title }) => (
                    <ul>
                        <li key={id}>
                            <Link to={`${url}movie/${id}`}>{title}</Link>
                        </li>
                    </ul>
                ))}
        </>
    );
}
