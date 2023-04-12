import Moment from 'moment';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

function timeAgoFormat(date) {
    let date1 = new Date(date);
    let date2 = new Date();
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    if (Difference_In_Days > 30) {
        return dateFormat(date);
    } else {
        const timeAgo = new TimeAgo('en-US');
        return timeAgo.format(new Date(date));
    }
}

function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = '';

    if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
}

function dateFormat(date) {
    return Moment(date).format('DD-MM-YYYY');
}

function getTimeGap(createdAt) {
    var now = new Date();
    var createdAtDate = new Date(createdAt);
    var timeDiff = now.getTime() - createdAtDate.getTime();
    var seconds = Math.floor(timeDiff / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    if (seconds < 5) {
        return 'just now';
    } else if (seconds < 60) {
        return seconds + ' seconds ago';
    } else if (minutes < 60) {
        return minutes + ' minutes ago';
    } else if (hours < 24) {
        return hours + ' hours ago';
    } else {
        return days + ' days ago';
    }
}

export { fancyTimeFormat, dateFormat, timeAgoFormat, getTimeGap };
