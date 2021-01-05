import { useState, useEffect } from 'react';
import { useRouteMatch, useLocation } from 'react-router-dom';
import * as theMovieDbAPI from '../../servises/themoviedb-api';
import s from './HomePage.module.css';
import Loader from '../../components/Loader';
import Status from '../../components/Status';
import MoviesList from '../../components/MoviesList';

export default function HomePage() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const location = useLocation();
    const { url } = useRouteMatch();
    const [trendingMovies, setTrendingMovies] = useState(null);

    useEffect(() => {
        setStatus(Status.PENDING);

        theMovieDbAPI
            .fetchTrendingMovies()
            .then(({ results }) => {
                setTrendingMovies(results);
                setStatus(Status.RESOLVED);
            })
            .catch(error => {
                setError(error);
                setStatus(Status.REJECTED);
            });
    }, []);

    return (
        <>
            <h2 className={s.caption}>Trending today</h2>

            {status === Status.PENDING && <Loader />}

            {status === Status.RESOLVED && (
                <MoviesList
                    movies={trendingMovies}
                    basicUrl={`${url}movies/`}
                    location={location}
                    label="GO BACK to Tranding"
                />
            )}

            {status === Status.REJECTED && <p>{error.message}</p>}
        </>
    );
}

// import { useState, useEffect } from 'react';
// import { Link, useRouteMatch, useLocation } from 'react-router-dom';
// import * as theMovieDbAPI from '../../servises/themoviedb-api';
// import s from './HomePage.module.css';
// import MakeSlug from '../../components/Slug';
// import Loader from '../../components/Loader';
// import Status from '../../components/Status';
// import noMoviePoster from '../../images/no_movie_poster.jpg';

// export default function HomePage() {
//     const [status, setStatus] = useState(null);
//     const [error, setError] = useState(null);

//     const location = useLocation();
//     const { url } = useRouteMatch();
//     const [trendingMovies, setTrendingMovies] = useState(null);

//     useEffect(() => {
//         setStatus(Status.PENDING);

//         theMovieDbAPI
//             .fetchTrendingMovies()
//             .then(({ results }) => {
//                 setTrendingMovies(results);
//                 setStatus(Status.RESOLVED);
//             })
//             .catch(error => {
//                 setError(error);
//                 setStatus(Status.REJECTED);
//             });
//     }, []);

//     return (
//         <>
//             <h2 className={s.caption}>Trending today</h2>

//             {status === Status.PENDING && <Loader />}

//             {status === Status.RESOLVED && (
//                 <>
//                     <ul className={s.moviesList}>
//                         {trendingMovies.map(({ id, title, poster_path }) => (
//                             <li key={id} className={s.moviesCard}>
//                                 <Link
//                                     to={{
//                                         pathname: `${url}movies/${MakeSlug(
//                                             `${title} ${id}`,
//                                         )}`,
//                                         state: {
//                                             from: {
//                                                 location,
//                                                 label: 'GO BACK to Tranding',
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
//                                         className={s.moviesImage}
//                                     />
//                                     <p className={s.moviesTitle}>{title}</p>
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
