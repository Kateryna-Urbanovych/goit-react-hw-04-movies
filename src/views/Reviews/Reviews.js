import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import Loader from '../../components/Loader';
import Status from '../../components/Status';

export default function Reviews({ movieId }) {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        setStatus(Status.PENDING);

        theMovieDbAPI
            .fetchMovieReviews(movieId)
            .then(({ results }) => {
                if (results.length === 0) {
                    setStatus(Status.IDLE);
                    return;
                }

                setReviews(results);
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
                <p>We don't have any reviews for this movie.</p>
            )}

            {status === Status.PENDING && <Loader />}

            {status === Status.RESOLVED && (
                <>
                    {reviews.map(({ author, content }) => (
                        <ul>
                            <li>
                                <h2>Author: {author}</h2>
                                <p>{content}</p>
                            </li>
                        </ul>
                    ))}
                </>
            )}

            {status === Status.REJECTED && <p>{error.message}</p>}
        </>
    );
}

Reviews.propTypes = {
    movieId: PropTypes.string.isRequired,
};
