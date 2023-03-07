import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store, { persistor } from '~/redux/store';
import reportWebVitals from '~/reportWebVitals';
import App from '~/App';
import GlobalStyles from '~/components/GlobalStyles';
import DarkModeContainer from '~/components/DarkMode/DarkModeContainer';
import LoadingMarkup from '~/components/LoadingMarkup';

// Change languages
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Suspense fallback={<LoadingMarkup />}>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <GlobalStyles>
                    <DarkModeContainer>
                        <BrowserRouter>
                            <Routes>
                                <Route path='/*' element={<App />} />
                            </Routes>
                        </BrowserRouter>
                    </DarkModeContainer>
                </GlobalStyles>
            </PersistGate>
        </Provider>
        <ToastContainer
            position='top-center'
            autoClose={1500}
            hideProgressBar={false}
            closeButton={true}
            theme='colored'
            icon={false}
            limit={3}
            pauseOnHover={false}
        />
    </Suspense>,
);

// root.render(
//     <React.StrictMode>
//         <Suspense fallback={<LoadingMarkup />}>
//             <Provider store={store}>
//                 <PersistGate persistor={persistor}>
//                     <GlobalStyles>
//                         <DarkModeContainer>
//                             <BrowserRouter>
//                                 <Routes>
//                                     <Route path='/*' element={<App />} />
//                                 </Routes>
//                             </BrowserRouter>
//                         </DarkModeContainer>
//                     </GlobalStyles>
//                 </PersistGate>
//             </Provider>
//             <ToastContainer
//                 position='top-center'
//                 autoClose={1500}
//                 hideProgressBar={false}
//                 closeButton={true}
//                 theme='colored'
//                 icon={false}
//                 limit={3}
//                 pauseOnHover={false}
//             />
//         </Suspense>
//     </React.StrictMode>,
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
