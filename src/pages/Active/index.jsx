import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { activeAccount } from '~/api/auth';

const Active = () => {
    const { active_token } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const active = async () => {
            await activeAccount({ active_token }, dispatch).then((isSuccess) => {
                if (isSuccess) {
                    toast.success('Active account successfully');
                    navigate('/login');
                } else {
                    toast.error('Active account failure!');
                    navigate('/signup');
                }
            });
        };

        active().catch(console.error);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div>Active</div>;
};

export default Active;
