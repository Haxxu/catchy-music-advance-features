import { routes } from '~/config';
// Layouts
import DefaultLayout from '~/layouts/DefaultLayout';
// Pages
import Login from '~/pages/Login';
import SignUp from '~/pages/SignUp';
import NotFound from '~/pages/NotFound';
import UnAuthorized from '~/pages/UnAuthorized';
import Active from '~/pages/Active';

const publicRoutes = [
    {
        path: routes.notFound,
        component: NotFound,
        layout: DefaultLayout,
    },
    {
        path: routes.login,
        component: Login,
        layout: DefaultLayout,
    },
    {
        path: routes.signup,
        component: SignUp,
        layout: DefaultLayout,
    },
    {
        path: routes.unAuthorized,
        component: UnAuthorized,
        layout: DefaultLayout,
    },
    {
        path: routes.active,
        component: Active,
        layout: DefaultLayout,
    },
];

export default publicRoutes;
