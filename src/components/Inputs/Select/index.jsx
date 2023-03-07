import React from 'react';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const Select = ({ label, options, handleInputState, placeholder, ...rest }) => {
    const handleChange = ({ currentTarget: input }) => {
        handleInputState(input.name, input.value);
    };

    return (
        <div className={cx('container')}>
            <p className={cx('label')}>{label}</p>
            <select onChange={handleChange} {...rest} className={cx('select')}>
                <option style={{ display: 'none' }}>{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
