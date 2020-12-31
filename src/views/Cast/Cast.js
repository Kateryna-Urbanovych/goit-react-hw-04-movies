import { useState, useEffect } from 'react';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import imageNotFound from '../../images/image-not-found.jpg';

export default function Cast({ movieId }) {
    const [cast, setCast] = useState(null);

    useEffect(() => {
        theMovieDbAPI.fetchMovieCast(movieId).then(({ cast }) => setCast(cast));
    }, [movieId]);

    // если cast нет - показать текст с ошибкой
    return (
        <>
            {cast &&
                cast.map(({ id, profile_path, name, character }) => (
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
    );
}
