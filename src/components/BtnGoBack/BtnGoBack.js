import PropTypes from 'prop-types';
import s from './BtnGoBack.module.css';

export default function BtnGoBack({ onClick, location }) {
    return (
        <button type="button" onClick={onClick} className={s.btnGoBack}>
            {location?.state?.from?.label ?? 'GO BACK'}
        </button>
    );
}

BtnGoBack.propTypes = {
    onClick: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
};
