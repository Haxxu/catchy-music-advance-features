import React, { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import styles from './styles.scoped.scss';
import GenreList from '~/components/GenreList';
import SearchResults from '~/components/SearchResults';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(styles);

const Search = () => {
    const [searchInput, setSearchInput] = useState('');
    const { t } = useTranslation();

    const searchInputRef = useRef();

    return (
        <div className={cx('container')}>
            <div className={cx('input-container')}>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <input
                    type='text'
                    placeholder={t('What do you want to listen to?')}
                    value={searchInput}
                    ref={searchInputRef}
                    onChange={() => setSearchInput(searchInputRef.current.value)}
                />
                {searchInput !== '' && (
                    <IconButton onClick={() => setSearchInput('')}>
                        <ClearIcon />
                    </IconButton>
                )}
            </div>
            <div className={cx('data-container')}>
                <SearchResults searchInput={searchInput} />
                <div className={cx('genres')}>
                    <div className={cx('heading')}>{t('Browse All')}</div>
                    <GenreList />
                </div>
                {/* <div className={cx('genres', { hide: searchInput.trim() !== '' })}>
                    <div className={cx('heading')}>Browse All</div>
                    <GenreList />
                </div> */}
            </div>
        </div>
    );
};

export default Search;
