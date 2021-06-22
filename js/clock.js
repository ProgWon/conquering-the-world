const worldClock = (() => {
    const timeDiff = {
        ko: 9,
        us: -4,
        ja: 9,
        ca: -4,
        ch: 8
    };

    const formatTime = time => (time < 10) ? "0" + time : time;

    setInterval(() => {
        const date = new Date();
        const utcTime = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
        const currTime = new Date(utcTime + (timeDiff.ko * 60 * 60 * 1000));
        const hour = formatTime(currTime.getHours());
        const minute = formatTime(currTime.getMinutes());
        const second = formatTime(currTime.getSeconds());

        const time = hour + ":" + minute + ":" + second;
        document.querySelector('.world-clock').textContent = time;
    }, 1000);
})();

window.addEventListener("DOMContentLoaded", worldClock);