import { useState, useEffect } from 'react';
import { useRouteMatch, useLocation } from 'react-router-dom';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import s from './HomePage.module.css';
import Loader from '../../components/Loader';
import Status from '../../components/Status';
import MoviesList from '../../components/MoviesList';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function HomePage() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { url } = useRouteMatch();
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setStatus(Status.PENDING);
        fetchMovies();
    }, []);

    const fetchMovies = () => {
        theMovieDbAPI
            .fetchTrendingMovies(page)
            .then(({ results }) => {
                setTrendingMovies(state => [...state, ...results]);
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
            <h2 className={s.caption}>Trending today</h2>

            {status === Status.PENDING && <Loader />}

            {status === Status.RESOLVED && (
                <InfiniteScroll
                    dataLength={trendingMovies.length}
                    next={fetchMovies}
                    hasMore={true}
                    loader={<Loader />}
                >
                    <MoviesList
                        movies={trendingMovies}
                        basicUrl={`${url}movies/`}
                        location={location}
                        label="GO BACK to Tranding"
                    />
                </InfiniteScroll>
            )}

            {status === Status.REJECTED && <p>{error.message}</p>}
        </>
    );
}
