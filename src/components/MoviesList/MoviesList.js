import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MakeSlug from '../Slug';
import s from './MoviesList.module.css';
import noMoviePoster from '../../images/no_movie_poster.jpg';

export default function MoviesList({ movies, basicUrl, location, label }) {
    return (
        <ul className={s.moviesList}>
            {movies.map(({ id, title, poster_path }) => (
                <li key={id} className={s.moviesCard}>
                    <Link
                        to={{
                            pathname: `${basicUrl}${MakeSlug(
                                `${title} ${id}`,
                            )}`,
                            state: {
                                from: { location, label },
                            },
                        }}
                    >
                        <img
                            src={
                                poster_path
                                    ? `https://image.tmdb.org/t/p/w500/${poster_path}`
                                    : noMoviePoster
                            }
                            alt={title}
                            className={s.moviesImage}
                        />
                        <p className={s.moviesTitle}>{title}</p>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

MoviesList.propTypes = {
    movies: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            poster_path: PropTypes.string.isRequired,
        }),
    ),
    basicUrl: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
};
