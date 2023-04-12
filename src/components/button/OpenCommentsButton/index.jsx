import React, { useState } from 'react';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 600,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    zIndex: 100000,
};

const OpenCommentsButton = ({ contextId, children }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <div onClick={handleOpen}>{children}</div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title-comment'
                aria-describedby='modal-modal-description-comment'
            >
                <Box sx={style} style={{ zIndex: 10000 }}>
                    <Typography id='modal-modal-title-comment' variant='h6' component='h2'>
                        Text in a modal
                    </Typography>
                    <Typography id='modal-modal-description-comment' sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};

export default OpenCommentsButton;
