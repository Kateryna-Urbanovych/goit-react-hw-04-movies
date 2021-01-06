import { useState, useEffect, lazy, Suspense } from 'react';
import {
    useParams,
    Route,
    useRouteMatch,
    useLocation,
    useHistory,
} from 'react-router-dom';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import s from './MovieDetailsPage.module.css';
import Loader from '../../components/Loader';
import Status from '../../components/Status';
import MovieCard from '../../components/MovieCard';

// Статические импорты
// import Cast from '../Cast';
// import Reviews from '../Reviews';

// Динамические импорты
const Cast = lazy(() => import('../Cast' /* webpackChunkName: "cast" */));
const Reviews = lazy(() =>
    import('../Reviews' /* webpackChunkName: "reviews" */),
);

export default function MovieDetailsPage() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const location = useLocation();
    const history = useHistory();

    const { slug } = useParams();
    const movieId = slug.match(/[a-z0-9]+$/)[0];

    const { url, path } = useRouteMatch();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        setStatus(Status.PENDING);

        theMovieDbAPI
            .fetchMovieById(movieId)
            .then(movie => {
                setMovie(movie);
                setStatus(Status.RESOLVED);
            })
            .catch(error => {
                setError(error);
                setStatus(Status.REJECTED);
            });
    }, [movieId]);

    const onGoBack = () => {
        history.push(location?.state?.from?.location ?? '/');
    };

    return (
        <>
            {status === Status.PENDING && <Loader />}

            {status === Status.RESOLVED && (
                <>
                    <button
                        type="button"
                        onClick={onGoBack}
                        className={s.btnGoBack}
                    >
                        {location?.state?.from?.label ?? 'GO BACK'}
                    </button>

                    <MovieCard movie={movie} url={url} location={location} />
                </>
            )}

            {status === Status.REJECTED && <p>{error.message}</p>}

            <Suspense fallback={<Loader />}>
                <Route path={`${path}/cast`}>
                    <Cast movieId={movieId} />
                </Route>

                <Route path={`${path}/reviews`}>
                    <Reviews movieId={movieId} />
                </Route>
            </Suspense>
        </>
    );
}
