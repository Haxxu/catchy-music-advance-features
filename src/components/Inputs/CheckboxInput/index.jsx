import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const CheckboxInput = ({ label, labelFontSize, ...rest }) => {
    return (
        <FormControlLabel
            className={cx('checkbox-container')}
            control={<Checkbox {...rest} color='primary' size='large' />}
            label={<span style={{ fontSize: labelFontSize }}>{label}</span>}
        />
    );
};

export default CheckboxInput;
