import { useState, useEffect } from 'react';
import { Link, useRouteMatch, useLocation } from 'react-router-dom';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import MakeSlug from '../../components/Slug';
import Loader from '../../components/Loader';

const Status = {
    PENDING: 'pending',
    RESOLVED: 'resolved',
    REJECTED: 'rejected',
};

export default function HomePage() {
    const [status, setStatus] = useState(Status.PENDING);
    const [error, setError] = useState(null);

    const location = useLocation();
    const { url } = useRouteMatch();
    const [trendingMovies, setTrendingMovies] = useState(null);

    useEffect(() => {
        setStatus(Status.PENDING);

        theMovieDbAPI
            .fetchTrendingMovies()
            .then(({ results }) => {
                setTrendingMovies(results);
                setStatus(Status.RESOLVED);
            })
            .catch(error => {
                setError(error);
                setStatus(Status.REJECTED);
            });
    }, []);

    return (
        <>
            <h2>Trending today</h2>

            {status === Status.PENDING && <Loader />}

            {status === Status.RESOLVED && (
                <>
                    {trendingMovies &&
                        trendingMovies.map(({ id, title }) => (
                            <ul>
                                <li key={id}>
                                    <Link
                                        to={{
                                            pathname: `${url}movies/${MakeSlug(
                                                `${title} ${id}`,
                                            )}`,
                                            state: {
                                                from: {
                                                    location,
                                                    label:
                                                        'GO BACK to Tranding',
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
