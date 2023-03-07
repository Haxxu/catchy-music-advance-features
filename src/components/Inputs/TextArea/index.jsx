import Joi from 'joi';
import classNames from 'classnames/bind';
import ClearIcon from '@mui/icons-material/Clear';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const TextArea = ({ label, error, handleInputState, handleErrorState, schema, rows, cols, customStyles, ...rest }) => {
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
            <textarea
                {...rest}
                rows={rows}
                cols={cols}
                onChange={handleChange}
                className={cx('input', {
                    error,
                })}
                style={{ maxWidth: '100%', minWidth: '100%', ...customStyles }}
            />
            {error && (
                <p className={cx('error-msg')}>
                    <ClearIcon /> {error}
                </p>
            )}
        </div>
    );
};

export default TextArea;
