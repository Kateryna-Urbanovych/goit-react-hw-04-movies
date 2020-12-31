// const Status = {
//     IDLE: 'idle',
//     PENDING: 'pending',
//     RESOLVED: 'resolved',
//     REJECTED: 'rejected',
// };

import { Route, Switch } from 'react-router-dom';
import AppBar from './components/AppBar';
// import Container from './components/Container';
import HomePage from './views/HomePage';
import MoviesPage from './views/MoviesPage';
import MovieDetailsPage from './views/MovieDetailsPage';

export default function App() {
    return (
        <>
            <AppBar />

            <Switch>
                <Route path="/" exact>
                    <HomePage />
                </Route>

                <Route path="/movie" exact>
                    <MoviesPage />
                </Route>

                <Route path="/movie/:movieId">
                    <MovieDetailsPage />
                </Route>
            </Switch>
        </>
    );
}
