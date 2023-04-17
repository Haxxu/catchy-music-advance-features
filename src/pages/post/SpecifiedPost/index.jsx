import React from 'react';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import PostForm from '~/components/Forms/PostForm';
import CommentsOfPost from '~/pages/post/CommentsOfPost';
import { routes } from '~/config';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const SpecifiedPost = () => {
    const { id } = useParams();
    const { t } = useTranslation();

    return (
        <div className={cx('container')}>
            {id !== 'new-post' && (
                <div className={cx('subnav')}>
                    <NavLink end className={cx('subnav-item')} to={routes.managePosts_specifiedPost_nested_edit}>
                        {t('Edit')}
                    </NavLink>
                    <NavLink className={cx('subnav-item')} to={routes.managePosts_specifiedPost_nested_comments}>
                        {t('Comments')}
                    </NavLink>
                </div>
            )}
            <div className={cx('main')}>
                <Routes>
                    <Route path='' element={<PostForm />} />
                    {id !== 'new-post' && <Route path='comments' element={<CommentsOfPost />} />}
                </Routes>
            </div>
        </div>
    );
};

export default SpecifiedPost;
