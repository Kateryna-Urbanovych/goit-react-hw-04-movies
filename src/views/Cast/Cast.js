import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import s from './Cast.module.css';
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

    return (
        <>
            {status === Status.IDLE && (
                <p>We don't have any cast for this movie.</p>
            )}

            {status === Status.PENDING && <Loader />}

            {status === Status.RESOLVED && (
                <>
                    <ul className={s.castList}>
                        {cast.map(({ id, profile_path, name, character }) => (
                            <li key={id} className={s.actorCard}>
                                <img
                                    src={
                                        profile_path
                                            ? `https://image.tmdb.org/t/p/w500${profile_path}`
                                            : imageNotFound
                                    }
                                    alt={name}
                                    className={s.actorImage}
                                />
                                <p className={s.actorName}>{name}</p>
                                <p>Character: {character}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {status === Status.REJECTED && <p>{error.message}</p>}
        </>
    );
}

Cast.propTypes = {
    movieId: PropTypes.string.isRequired,
};
