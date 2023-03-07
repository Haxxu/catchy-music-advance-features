import Joi from 'joi';
import classNames from 'classnames/bind';
import ClearIcon from '@mui/icons-material/Clear';
import { TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const MUITextField = ({ label, error, handleInputState, handleErrorState, schema, ...rest }) => {
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
        <TextField
            {...rest}
            error={!!error}
            helperText={error}
            onChange={handleChange}
            InputLabelProps={{
                style: {
                    fontSize: '1.5rem',
                },
            }}
            InputProps={{
                style: {
                    fontSize: '2rem',
                    borderRadius: '1rem',
                },
            }}
            FormHelperTextProps={{
                style: {
                    fontSize: '1.6rem',
                },
            }}
            fullWidth
        />
    );
};

export default MUITextField;
