import { useState, useEffect } from 'react';
import { useRouteMatch, useLocation } from 'react-router-dom';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import s from './HomePage.module.css';
import Loader from '../../components/Loader';
import Status from '../../components/Status';
import MoviesList from '../../components/MoviesList';

export default function HomePage() {
    const [status, setStatus] = useState(null);
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
            <h2 className={s.caption}>Trending today</h2>

            {status === Status.PENDING && <Loader />}

            {status === Status.RESOLVED && (
                <MoviesList
                    movies={trendingMovies}
                    basicUrl={`${url}movies/`}
                    location={location}
                    label="GO BACK to Tranding"
                />
            )}

            {status === Status.REJECTED && <p>{error.message}</p>}
        </>
    );
}
