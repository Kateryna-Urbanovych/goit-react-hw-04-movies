import { useState, useEffect } from 'react';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import s from './MoviesPage.module.css';
import Loader from '../../components/Loader';
import Status from '../../components/Status';
import noResultsFound from '../../images/no_results_found.jpg';
import MoviesList from '../../components/MoviesList';

export default function MoviesPage() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const [movieQuery, setMovieQuery] = useState('');
    const [movies, setMovies] = useState(null);

    const { url } = useRouteMatch();

    const history = useHistory();
    const location = useLocation();
    const searchMovie = new URLSearchParams(location.search).get('query') ?? '';

    const handleMovieQueryChange = ({ target }) => {
        setMovieQuery(target.value.toLowerCase());
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (movieQuery.trim() === '') {
            return toast.warning('Please, write some request');
        }

        history.push({ ...location, search: `query=${movieQuery}` });

        // По превью дз запрос удаляется!!!
        setMovieQuery('');
    };

    useEffect(() => {
        if (searchMovie === '') {
            return;
        }

        setStatus(Status.PENDING);

        theMovieDbAPI
            .fetchMovieByName(searchMovie)
            .then(({ results }) => {
                if (results.length === 0) {
                    setStatus(Status.IDLE);
                    return;
                }

                setMovies(results);
                setStatus(Status.RESOLVED);
            })
            .catch(error => {
                setError(error);
                setStatus(Status.REJECTED);
            });
    }, [searchMovie]);

    return (
        <>
            <form onSubmit={handleSubmit} className={s.form}>
                <input
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search movies"
                    value={movieQuery}
                    onChange={handleMovieQueryChange}
                    className={s.input}
                />
                <button type="submit" className={s.btnSearch}>
                    Search
                </button>
            </form>

            {status === Status.IDLE && (
                <img src={noResultsFound} alt="No results found" />
            )}

            {status === Status.PENDING && <Loader />}

            {status === Status.RESOLVED && (
                <MoviesList
                    movies={movies}
                    basicUrl={`${url}/`}
                    location={location}
                    label={`GO BACK to Search <${searchMovie}>`}
                />
            )}

            {status === Status.REJECTED && <p>{error.message}</p>}
        </>
    );
}

// import { useState, useEffect } from 'react';
// import { Link, useRouteMatch, useHistory, useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import * as theMovieDbAPI from '../../servises/themoviedb-api';
// import style from '../HomePage/HomePage.module.css'; //сделать одним списком!!!
// import s from './MoviesPage.module.css';
// import MakeSlug from '../../components/Slug';
// import Loader from '../../components/Loader';
// import Status from '../../components/Status';
// import noResultsFound from '../../images/no_results_found.jpg';
// import noMoviePoster from '../../images/no_movie_poster.jpg';

// export default function MoviesPage() {
//     const [status, setStatus] = useState(null);
//     const [error, setError] = useState(null);

//     const [movieQuery, setMovieQuery] = useState('');
//     const [movies, setMovies] = useState(null);

//     const { url } = useRouteMatch();

//     const history = useHistory();
//     const location = useLocation();
//     const searchMovie = new URLSearchParams(location.search).get('query') ?? '';

//     const handleMovieQueryChange = ({ target }) => {
//         setMovieQuery(target.value.toLowerCase());
//     };

//     const handleSubmit = event => {
//         event.preventDefault();

//         if (movieQuery.trim() === '') {
//             return toast.warning('Please, write some request');
//         }

//         history.push({ ...location, search: `query=${movieQuery}` });

//         // По превью дз запрос удаляется!!!
//         setMovieQuery('');
//     };

//     useEffect(() => {
//         if (searchMovie === '') {
//             return;
//         }

//         setStatus(Status.PENDING);

//         theMovieDbAPI
//             .fetchMovieByName(searchMovie)
//             .then(({ results }) => {
//                 if (results.length === 0) {
//                     setStatus(Status.IDLE);
//                     return;
//                 }

//                 setMovies(results);
//                 setStatus(Status.RESOLVED);
//             })
//             .catch(error => {
//                 setError(error);
//                 setStatus(Status.REJECTED);
//             });
//     }, [searchMovie]);

//     return (
//         <>
//             <form onSubmit={handleSubmit} className={s.form}>
//                 <input
//                     type="text"
//                     autoComplete="off"
//                     autoFocus
//                     placeholder="Search movies"
//                     value={movieQuery}
//                     onChange={handleMovieQueryChange}
//                     className={s.input}
//                 />
//                 <button type="submit" className={s.btnSearch}>
//                     Search
//                 </button>
//             </form>

//             {status === Status.IDLE && (
//                 <img src={noResultsFound} alt="No results found" />
//             )}

//             {status === Status.PENDING && <Loader />}

//             {status === Status.RESOLVED && (
//                 <>
//                     <ul className={style.moviesList}>
//                         {movies.map(({ id, title, poster_path }) => (
//                             <li key={id} className={style.moviesCard}>
//                                 <Link
//                                     to={{
//                                         pathname: `${url}/${MakeSlug(
//                                             `${title} ${id}`,
//                                         )}`,
//                                         state: {
//                                             from: {
//                                                 location,
//                                                 label: `GO BACK to Search <${searchMovie}>`,
//                                             },
//                                         },
//                                     }}
//                                 >
//                                     <img
//                                         src={
//                                             poster_path
//                                                 ? `https://image.tmdb.org/t/p/w500/${poster_path}`
//                                                 : noMoviePoster
//                                         }
//                                         alt={title}
//                                         className={style.moviesImage}
//                                     />
//                                     <p className={style.moviesTitle}>{title}</p>
//                                 </Link>
//                             </li>
//                         ))}
//                     </ul>
//                 </>
//             )}

//             {status === Status.REJECTED && <p>{error.message}</p>}
//         </>
//     );
// }
