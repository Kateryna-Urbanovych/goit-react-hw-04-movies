import { useState, useEffect, lazy, Suspense } from 'react';
import {
    useParams,
    NavLink,
    Route,
    useRouteMatch,
    useLocation,
    useHistory,
} from 'react-router-dom';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import s from './MovieDetailsPage.module.css';
import Loader from '../../components/Loader';
import Status from '../../components/Status';
import noMoviePoster from '../../images/no_movie_poster.jpg';

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

                    <div className={s.wrapper}>
                        <img
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                    : noMoviePoster
                            }
                            alt={movie.title}
                            className={s.movieImage}
                        />
                        <div>
                            <h1 className={s.movieTitle}>{movie.title}</h1>
                            <p>User Score: {movie.vote_average * 10}%</p>
                            <h2>Overview:</h2>
                            <p>{movie.overview}</p>
                            <h2>Genres:</h2>
                            <p>
                                {movie.genres
                                    .map(({ name }) => name)
                                    .join(', ')}
                            </p>
                        </div>
                    </div>

                    <hr />
                    <div className={s.movieInfo}>
                        <h2>Additional information:</h2>
                        <ul className={s.movieLinks}>
                            <li>
                                <NavLink
                                    to={{
                                        pathname: `${url}/cast`,
                                        state: {
                                            from: location?.state?.from ?? '/',
                                        },
                                    }}
                                >
                                    Cast
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to={{
                                        pathname: `${url}/reviews`,
                                        state: {
                                            from: location?.state?.from ?? '/',
                                        },
                                    }}
                                >
                                    Reviews
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <hr />
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
