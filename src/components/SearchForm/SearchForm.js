import PropTypes from 'prop-types';
import s from './SearchForm.module.css';

export default function SearchForm({ onSubmit, movieQuery, onChange }) {
    return (
        <form onSubmit={onSubmit} className={s.form}>
            <input
                type="text"
                autoComplete="off"
                autoFocus
                placeholder="Search movies"
                value={movieQuery}
                onChange={onChange}
                className={s.input}
            />
            <button type="submit" className={s.btnSearch}>
                Search
            </button>
        </form>
    );
}

SearchForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    movieQuery: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
