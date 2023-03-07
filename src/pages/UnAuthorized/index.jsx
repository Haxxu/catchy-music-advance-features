import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import record from '~/assets/images/record.svg';
import recordArm from '~/assets/images/record-arm.svg';
import styles from './styles.scoped.scss';
import CustomButton from '~/components/CustomButton';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const UnAuthorized = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className={cx('container')}>
            <div className='left'>
                <div className={cx('info')}>
                    <h1 className={cx('title')}>403 Unauthorized</h1>
                    <p className={cx('text')}>
                        {t("Either you aren't cool enough to visit this page or it doesn't exist...")}
                        <em>{t('like your social life.')}</em>
                    </p>
                </div>
                <div className={cx('navigation')}>
                    <CustomButton onClick={() => goBack()}>{t('Go Back')}</CustomButton>
                </div>
            </div>
            <div className={cx('right')}>
                <img src={record} alt='record' className={cx('record')} />
                <img src={recordArm} alt='record-arm' className={cx('record-arm')} />
            </div>
        </div>
    );
};

export default UnAuthorized;
