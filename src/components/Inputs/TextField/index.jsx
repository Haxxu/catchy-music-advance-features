import Joi from 'joi';
import classNames from 'classnames/bind';
import ClearIcon from '@mui/icons-material/Clear';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const TextField = ({ label, error, handleInputState, handleErrorState, schema, customStyles, ...rest }) => {
    const validateProperty = ({ name, value }) => {
        const obj = { [name]: value };
        const inputSchema = Joi.object({ [name]: schema });
        const { error } = inputSchema.validate(obj);

        return error ? error.details[0].message : '';
    };

    const handleChange = ({ currentTarget: input }) => {
        if (schema) {
            const errorMessage = validateProperty(input);
            if (handleErrorState) {
                handleErrorState(input.name, errorMessage);
            }
        }
        handleInputState(input.name, input.value);
    };

    return (
        <div className={cx('container')}>
            <p
                className={cx('label', {
                    error,
                })}
            >
                {label}
            </p>
            <input
                {...rest}
                onChange={handleChange}
                className={cx('input', {
                    error,
                })}
                style={{ ...customStyles }}
            />
            {error && (
                <p className={cx('error-msg')}>
                    <ClearIcon /> {error}
                </p>
            )}
        </div>
    );
};

export default TextField;
