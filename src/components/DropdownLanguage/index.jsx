import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.scoped.scss';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const languages = [
    {
        code: 'vi',
        name: 'Tiếng Việt (Vietnamese)',
        country_code: 'vi',
    },
    {
        code: 'en',
        name: 'English (English)',
        country_code: 'en',
    },
];

const DropdownLanguague = () => {
    const [currentLangCode, setCurrentLangCode] = useState(localStorage.getItem('i18nextLng'));
    const { t, i18n } = useTranslation();

    const handleChangeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setCurrentLangCode(lng);
    };

    return (
        <div className={cx('container')}>
            <div className={cx('label')}>{t('Choose language')}</div>
            <select
                className={cx('select')}
                onChange={(e) => handleChangeLanguage(e.currentTarget.value)}
                defaultValue={currentLangCode}
            >
                {languages.map(({ name, code }) => (
                    <option key={code} value={code} className={cx('option')}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropdownLanguague;
