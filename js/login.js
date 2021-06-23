const login = (() => {
    const $userId = document.getElementById('userId');
    const $userPassword = document.getElementById('userPassword');
    const $userIdError = document.getElementById('userIdError');
    const $userPasswordError = document.getElementById('userPasswordError');
    const $invalidError = document.getElementById('invalidError');
    const userStorage = window.localStorage;

    document.querySelector('.btn-login').onclick = e => {
        e.preventDefault();
        $userIdError.style.opacity = $userId.value ? '0' : '1';
        $userPasswordError.style.opacity = $userPassword.value ? '0' : '1';
        if (!$userId.value || !$userPassword.value) return;

        if (userStorage.getItem($userId.value) !== $userPassword.value) {
            $invalidError.style.opacity = '1';
        } else {
            document.querySelector('.login-wrapper').style.opacity = '0';
        }
    };
})();

document.addEventListener('DOMContentLoaded', login);