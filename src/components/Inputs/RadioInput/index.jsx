import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const RadioInput = ({ label, handleInputState, name, value, options, required, fontLabelSize = '1.6rem', ...rest }) => {
    const handleChange = ({ currentTarget: input }) => {
        handleInputState(input.name, input.value);
    };

    return (
        <div className={cx('container')}>
            <p style={{ fontWeight: '700' }}>{label}</p>
            <RadioGroup {...rest} row name={name} onChange={handleChange}>
                {options.map((option, index) => (
                    <FormControlLabel
                        key={index}
                        value={option}
                        control={
                            <Radio
                                disableRipple
                                style={{
                                    color: 'var(--primary-color)',
                                    transform: 'scale(1.2)',
                                }}
                                required={required}
                            />
                        }
                        label={<span style={{ fontSize: fontLabelSize }}>{option}</span>}
                        className={cx('radio-input')}
                    />
                ))}
            </RadioGroup>
        </div>
    );
};

export default RadioInput;
