import React from 'react';
import classNames from 'classnames/bind';

import DropdownLanguague from '~/components/DropdownLanguage';
import styles from './styles.scoped.scss';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const Settings = () => {
    const { t } = useTranslation();

    return (
        <div className={cx('container')}>
            <div className={cx('section')}>
                <div className={cx('heading')}>{t('Language')}</div>
                <DropdownLanguague />
            </div>
            <div className={cx('languages')} />
        </div>
    );
};

export default Settings;
