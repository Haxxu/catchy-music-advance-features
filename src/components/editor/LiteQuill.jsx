import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const LiteQuill = ({ setBody, body }) => {
    const modules = {
        toolbar: {
            container,
        },
    };

    return (
        <div className='text-editor'>
            <ReactQuill
                theme='snow'
                modules={modules}
                placeholder='Write somethings...'
                onChange={(e) => setBody(e)}
                value={body}
            />
        </div>
    );
};

let container = [
    [{ font: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block', 'link'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
];

export default LiteQuill;
