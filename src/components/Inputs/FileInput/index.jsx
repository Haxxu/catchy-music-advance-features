import React, { useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { Button, CircularProgress } from '@mui/material';
import BackupIcon from '@mui/icons-material/Backup';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import storage from '~/database/firebase';
import styles from './styles.scoped.scss';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const FileInput = ({ name, label, value, icon, type, handleInputState, customStyles, ...rest }) => {
    const [progress, setProgress] = useState(0);
    const [progressShow, setProgressShow] = useState(false);
    const inputRef = useRef();

    const handleUpload = () => {
        setProgressShow(true);
        const fileName = new Date().getTime() + value.name;
        const storageRef = ref(storage, type === 'audio' ? `/audio/${fileName}` : `/images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, value);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const uploaded = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(uploaded);
            },
            (error) => {
                console.log(error);
                toast.error('An error occured while uploading!');
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    handleInputState(name, url);
                    if (type === 'audio') {
                        const audio = new Audio(url);
                        audio.addEventListener(
                            'loadedmetadata',
                            () => {
                                const duration = Math.floor(audio.duration);
                                handleInputState('duration', duration);
                            },
                            false,
                        );
                    }
                });
            },
        );
    };

    return (
        <div className={cx('container')} style={{ ...customStyles }}>
            <input
                type='file'
                ref={inputRef}
                onChange={(e) => {
                    handleInputState(name, e.currentTarget.files[0]);
                }}
                {...rest}
            />
            <Button
                variant='contained'
                color='primary'
                sx={{
                    width: '15rem',
                    border: '1px solid var(--text-primary)',
                    background: 'transparent',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                }}
                onClick={() => inputRef.current.click()}
            >
                {icon}
                {label}
            </Button>
            {type === 'image' && value && (
                <img src={typeof value === 'string' ? value : URL.createObjectURL(value)} alt='file' />
            )}
            {type === 'audio' && value && (
                <audio src={typeof value === 'string' ? value : URL.createObjectURL(value)} controls />
            )}
            {value !== null && !progressShow && typeof value !== 'string' && (
                <Button
                    onClick={handleUpload}
                    variant='contained'
                    color='primary'
                    startIcon={<BackupIcon />}
                    sx={{ width: '10rem' }}
                >
                    Upload
                </Button>
            )}
            {progressShow && progress < 100 && (
                <div className={cx('progress-container')}>
                    <CircularProgress
                        variant='determinate'
                        value={progress}
                        color='primary'
                        sx={{ fontSize: '1.8rem' }}
                    />
                    <p>{progress}%</p>
                </div>
            )}
            {progress === 100 && (
                <div className={cx('progress-container')}>
                    <CheckCircleIcon className={cx('styles.success')} color='success' fontSize='large' />
                </div>
            )}
        </div>
    );
};

export default FileInput;
