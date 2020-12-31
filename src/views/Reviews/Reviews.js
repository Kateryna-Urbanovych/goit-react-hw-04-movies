import { useState, useEffect } from 'react';
import * as theMovieDbAPI from '../../servises/themoviedb-api';

export default function Reviews({ movieId }) {
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        theMovieDbAPI
            .fetchMovieReviews(movieId)
            .then(({ results }) => setReviews(results));
    }, [movieId]);

    // если cast нет - показать текст с ошибкой
    return (
        reviews &&
        reviews.map(({ author, content }) => (
            <ul>
                <li>
                    <h2>Author: {author}</h2>
                    <p>{content}</p>
                </li>
            </ul>
        ))
    );
}
