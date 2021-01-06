import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import s from './MovieCard.module.css';
import noMoviePoster from '../../images/no_movie_poster.jpg';

export default function MovieCard({ movie, url, location }) {
    const { poster_path, title, vote_average, overview, genres } = movie;

    return (
        <>
            <div className={s.wrapper}>
                <img
                    src={
                        poster_path
                            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
                            : noMoviePoster
                    }
                    alt={title}
                    className={s.movieImage}
                />
                <div>
                    <h1 className={s.movieTitle}>{title}</h1>
                    <p>User Score: {vote_average * 10}%</p>
                    <h2>Overview:</h2>
                    <p>{overview}</p>
                    <h2>Genres:</h2>
                    <p>{genres.map(({ name }) => name).join(', ')}</p>
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
    );
}

MovieCard.propTypes = {
    movie: PropTypes.objectOf(
        PropTypes.shape({
            poster_path: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            vote_average: PropTypes.number.isRequired,
            overview: PropTypes.string.isRequired,
            genres: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                }),
            ),
        }),
    ),
    url: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
};
