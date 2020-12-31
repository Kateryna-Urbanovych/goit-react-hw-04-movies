import { useState, useEffect } from 'react';
import { useParams, NavLink, Route, useRouteMatch } from 'react-router-dom';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import Cast from '../Cast';
import Reviews from '../Reviews';

export default function MovieDetailsPage() {
    const { movieId } = useParams();
    const { url, path } = useRouteMatch();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        theMovieDbAPI.fetchMovieById(movieId).then(setMovie);
    }, [movieId]);

    return (
        <>
            {movie && (
                <>
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
                            <NavLink to={`${url}/cast`}>Cast</NavLink>
                        </li>
                        <li>
                            <NavLink to={`${url}/reviews`}>Reviews</NavLink>
                        </li>
                    </ul>
                </>
            )}

            <Route path={`${path}/cast`}>
                <Cast movieId={movieId} />
            </Route>

            <Route path={`${path}/reviews`}>
                <Reviews movieId={movieId} />
            </Route>
        </>
    );
}
