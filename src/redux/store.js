import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { authReducer } from './authSlice';
import { userInterfaceReducer } from './userInterfaceSlice';
import { userReducer } from './userSlice';
import { audioPlayerReducer } from './audioPlayerSlice';
import { updateStateReducer } from './updateStateSlice';
import { commentReducer } from './commentSlice';
import { socketReducer } from './socketSlice';
import { postReducer } from './postSlice';
import { notificationReducer } from './notificationSlice';

const reducers = combineReducers({
    auth: authReducer,
    userInterface: userInterfaceReducer,
    user: userReducer,
    audioPlayer: audioPlayerReducer,
    updateState: updateStateReducer,
    comments: commentReducer,
    socket: socketReducer,
    post: postReducer,
    notification: notificationReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'userInterface', 'user', 'audioPlayer', 'updateState'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export default store;