import { useState, useEffect } from 'react';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import Loader from '../../components/Loader';
import Status from '../../components/Status';
import imageNotFound from '../../images/image_not_found.jpg';

export default function Cast({ movieId }) {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [cast, setCast] = useState(null);

    useEffect(() => {
        setStatus(Status.PENDING);

        theMovieDbAPI
            .fetchMovieCast(movieId)
            .then(({ cast }) => {
                if (cast.length === 0) {
                    setStatus(Status.IDLE);
                    return;
                }

                setCast(cast);
                setStatus(Status.RESOLVED);
            })
            .catch(error => {
                setError(error);
                setStatus(Status.REJECTED);
            });
    }, [movieId]);

    // если cast нет - показать текст с ошибкой
    return (
        <>
            {status === Status.IDLE && (
                <p>We don't have any cast for this movie.</p>
            )}

            {status === Status.PENDING && <Loader />}

            {status === Status.RESOLVED && (
                <>
                    {cast.map(({ id, profile_path, name, character }) => (
                        <ul>
                            <li key={id}>
                                <img
                                    src={
                                        profile_path
                                            ? `https://image.tmdb.org/t/p/w500${profile_path}`
                                            : imageNotFound
                                    }
                                    alt={name}
                                    width="100"
                                />
                                <p>{name}</p>
                                <p>Character: {character}</p>
                            </li>
                        </ul>
                    ))}
                </>
            )}

            {status === Status.REJECTED && <p>{error.message}</p>}
        </>
    );
}
