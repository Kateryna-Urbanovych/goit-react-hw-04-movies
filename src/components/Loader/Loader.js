import ReactLoader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import s from './Loader.module.css';

export default function Loader() {
    return (
        <ReactLoader
            type="Bars"
            color="#2a363b;"
            height={100}
            width={100}
            className={s.loader}
        />
    );
}
