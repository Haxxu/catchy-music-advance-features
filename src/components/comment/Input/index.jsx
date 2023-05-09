import { Button } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';

import LiteQuill from '~/components/editor/LiteQuill';
import './index.scss';

const Input = ({ callback, edit, setEdit }) => {
    const [body, setBody] = useState('');
    const divRef = useRef(null);

    useEffect(() => {
        if (edit) setBody(edit.content);
    }, [edit]);

    const handleSubmit = () => {
        const div = divRef.current;
        const text = div?.innerText;

        if (!text.trim()) {
            if (setEdit) return setEdit(undefined);
            return;
        }

        // console.log(body);

        callback(body);
        setBody('');
    };

    return (
        <div>
            <LiteQuill body={body} setBody={setBody} />
            <div ref={divRef} dangerouslySetInnerHTML={{ __html: body }} style={{ display: 'none' }} />

            <Button
                sx={{ fontSize: '1rem', fontWeight: '700', marginTop: '3px' }}
                color='info'
                variant='contained'
                onClick={handleSubmit}
            >
                {edit ? 'Update' : 'Send'}
            </Button>
            {/* <button className='btn btn-dark ms-auto d-block px-4 mt-2' /> */}
        </div>
    );
};

export default Input;