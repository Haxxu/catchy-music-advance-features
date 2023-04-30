import { Fragment, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';

import { publicRoutes, privateRoutes, adminRoutes, artistRoutes, podcasterRoutes } from '~/routes';
import MainLayout from '~/layouts/MainLayout';
import AdminDashboardLayout from '~/layouts/AdminDashboardLayout';
import ArtistDashboardLayout from './layouts/ArtistDashboardLayout';
import RequireAuth from './components/RequireAuth';
import { setSocketAction } from './redux/socketSlice';
import SocketClient from '~/utils/SocketClient';
import { fetchUserFollowing } from './api/user';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = io(process.env.REACT_APP_SERVER_URL);

        socket.on('connect', () => {
            dispatch(setSocketAction(socket));
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchUserFollowing(dispatch);
        };

        fetchData().catch(console.error);
    }, [dispatch]);

    return (
        <Fragment>
            <SocketClient />
            <Routes>
                {/* Public Routes */}
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = MainLayout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}

                {/* Private routes */}
                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = MainLayout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route key={index} element={<RequireAuth allowedRoles={route.roles} />}>
                            <Route
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        </Route>
                    );
                })}

                {/* Admin routes */}
                {adminRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = AdminDashboardLayout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route key={index} element={<RequireAuth allowedRoles={route.roles} />}>
                            <Route
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        </Route>
                    );
                })}

                {/* Artist routes */}
                {artistRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = ArtistDashboardLayout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route key={index} element={<RequireAuth allowedRoles={route.roles} />}>
                            <Route
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        </Route>
                    );
                })}

                {/* Podcaster routes */}
                {podcasterRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = ArtistDashboardLayout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route key={index} element={<RequireAuth allowedRoles={route.roles} />}>
                            <Route
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        </Route>
                    );
                })}

                {/* Catch All */}
                <Route path='/*' element={<Navigate to='/not-found' replace={true} />} />
            </Routes>
        </Fragment>
    );
}

export default App;
