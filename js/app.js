// LOGIN PAGE
(() => {
  const $userId = document.getElementById('userId');
  const $userPassword = document.getElementById('userPW');
  const $userIdError = document.getElementById('userIdError');
  const $userPasswordError = document.getElementById('userPasswordError');
  const $invalidError = document.getElementById('invalidError');
  const $allErrors = document.querySelectorAll('.error-message');
  const userStorage = window.localStorage;

  document.querySelector('.login-form').onsubmit = e => {
    e.preventDefault();
    $allErrors.forEach(err => {
      err.style.opacity = 0;
    });

    $userIdError.style.opacity = $userId.value ? '0' : '1';
    $userPasswordError.style.opacity = $userPassword.value ? '0' : '1';
    if (!$userId.value || !$userPassword.value) return;

    const userPW = userStorage.getItem($userId.value);
    if (userPW !== $userPassword.value) {
      $invalidError.style.opacity = 1;
      return;
    }

    document.querySelector('.login-wrapper').style.display = 'none';
    document.querySelector('.whiteout').style.display = 'none';
  };
})();

// MAIN PAGE