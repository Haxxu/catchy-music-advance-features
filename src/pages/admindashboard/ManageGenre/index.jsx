import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames/bind';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { routes } from '~/config';
import ManageGenreTable from '~/components/admin/Table/ManageGenreTable';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const ManageGenre = () => {
    const { t } = useTranslation();

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <h1>{t('Genres')}</h1>
                <Link to={routes.admin_manageGenre + '/new-genre'}>
                    <Button
                        size='large'
                        color='secondary'
                        variant='contained'
                        startIcon={<AddIcon />}
                        sx={{
                            fontSize: '1.4rem',
                            fontWeight: '600',
                        }}
                    >
                        {t('Add new genre')}
                    </Button>
                </Link>
            </div>
            <div className={cx('data-container')}>
                <ManageGenreTable />
            </div>
        </div>
    );
};

export default ManageGenre;
