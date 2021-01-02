import { useState, useEffect } from 'react';
import { Link, useRouteMatch, useLocation } from 'react-router-dom';
import * as theMovieDbAPI from '../../servises/themoviedb-api';

export default function HomePage() {
    const location = useLocation();
    // console.log('HomePage', location);
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
                            <Link
                                to={{
                                    pathname: `${url}movies/${id}`,
                                    state: {
                                        from: {
                                            location,
                                            label: 'GO BACK to Tranding',
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
