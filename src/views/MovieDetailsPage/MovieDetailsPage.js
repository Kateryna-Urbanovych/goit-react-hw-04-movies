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

// Статические импорты
// import Cast from '../Cast';
// import Reviews from '../Reviews';

// Динамические импорты
const Cast = lazy(() => import('../Cast' /* webpackChunkName: "cast" */));
const Reviews = lazy(() =>
    import('../Reviews' /* webpackChunkName: "reviews" */),
);

export default function MovieDetailsPage() {
    const location = useLocation();
    console.log('MovieDetailsPage', location);
    const history = useHistory();
    // console.log(history);
    const { movieId } = useParams();
    const { url, path } = useRouteMatch();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        theMovieDbAPI.fetchMovieById(movieId).then(setMovie);
    }, [movieId]);

    const onGoBack = () => {
        history.push(location?.state?.from ?? '/');
    };

    return (
        <>
            {movie && (
                <>
                    <button type="button" onClick={onGoBack}>
                        Go back
                    </button>
                    <hr />
                    <img
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        alt={movie.title}
                        width="250"
                    />
                    <h1>{movie.title}</h1>
                    <p>User Score: {movie.vote_average * 10}%</p>
                    <h2>Overview:</h2>
                    <p>{movie.overview}</p>
                    <h2>Genres:</h2>
                    <p>
                        {movie.genres.map(({ name }) => (
                            <span>{name}</span>
                        ))}
                    </p>
                    <hr />
                    <p>Additional information</p>
                    <ul>
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
                </>
            )}

            <Suspense fallback={<h1>Загружаем...</h1>}>
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
