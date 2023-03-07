import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.scoped.scss';

const cx = classNames.bind(styles);

const Detail = ({ data }) => {
    const [dataArray, setDataArray] = useState([]);

    useEffect(() => {
        setDataArray([]);
        for (let key in data) {
            if (!data.hasOwnProperty(key)) continue;

            let obj = data[key];

            if (typeof obj !== 'object') {
                setDataArray((prev) => [
                    ...prev,
                    <p key={key}>
                        {key}: {obj}
                    </p>,
                ]);
            } else {
                const objArray = [];
                for (let prop in obj) {
                    if (!obj.hasOwnProperty(prop)) continue;

                    objArray.push(prop);
                }
                setDataArray((prev) => [
                    ...prev,
                    <p key={key}>
                        {key}: {objArray}
                    </p>,
                ]);
            }
        }
    }, [data]);

    return <div className={cx('container')}>{dataArray}</div>;
};

export default Detail;
