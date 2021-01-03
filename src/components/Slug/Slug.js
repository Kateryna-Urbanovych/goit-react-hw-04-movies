import PropTypes from 'prop-types';
import slugify from 'slugify';

export default function MakeSlug(string) {
    return slugify(string, { lower: true });
}

MakeSlug.propTypes = {
    string: PropTypes.string.isRequired,
};
