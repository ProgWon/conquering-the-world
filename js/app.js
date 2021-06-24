// constant
const serviceCountry = ['KR', 'JP', 'US'];

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

// DROPDOWN MENU
const dropdownMenu = (() => {
  const $customSelectWrapper = document.querySelector('.custom-select-wrapper');
  const $customSelect = document.querySelector('.custom-select');
  const $customOptions = document.querySelector('.custom-options');
  const $customSpan = document.querySelector('.custom-select-trigger > span');

  const toggleCustomOptions = $target => {
    [...$customOptions.children].forEach(option => {
      option.classList.toggle('selected', $target === option);
    });
  };

  $customSelect.onclick = () => {
    $customSelect.classList.toggle('open');
  };

  $customOptions.onclick = e => {
    if (
      !e.target.matches('.custom-option') &&
      e.target.classList.contains('selected')
    )
      return;

    toggleCustomOptions(e.target);
    $customSpan.textContent = e.target.textContent;
  };

  return {
    showDropDownMenu() {
      $customSelectWrapper.style.opacity = 1;
      $customSelectWrapper.disabled = false;
    },
    hideDropDownMenu() {
      $customSelectWrapper.style.opacity = 0;
      $customSelectWrapper.disabled = true;
    }
  }
})();

// MAIN PAGE
document.querySelector('.map-obj').onload = () => {
  const HALF_MAP_WIDTH = 1009.11 / 2;
  const HALF_MAP_HEIGHT = 665.24 / 2;

  const $mapObj = document.querySelector('.map-obj');
  const $svg = $mapObj.contentDocument.querySelector('svg');
  const $g = $svg.querySelector('g');
  const $backBtn = document.querySelector('.back-btn');
  const $customSelectBtn = document.querySelector('.custom-select-btn');

  const $countries = [...$g.children];
  const $serviceContry = serviceCountry.reduce((obj, key) => {
    obj[key] = $svg.getElementById(key);
    return obj;
  }, {});

  // variables
  let flag = false;

  // functions
  const getCountryCenterPos = $target => {
    const rect = $target.getBoundingClientRect();
    return [rect.width / 2 + rect.x, rect.height / 2 + rect.y];
  };

  const getScaleRatio = $target => {
    const rectWidth = $target.getBoundingClientRect().width;
    return rectWidth < 50 ? 25 : rectWidth < 200 ? 5 : 2;
  };

  const translateAndScaleMap = (x, y, ratio) => {
    if (!$g.style.transition) $g.style.transition = '1s';
    $g.style.transform = `translate3D(${x}px, ${y}px, 0) scale(${ratio})`;
  };

  const showBackBtn = () => {
    $backBtn.style.opacity = 1;
    $backBtn.disabled = false;
  };

  const hideBackBtn = () => {
    $backBtn.style.opacity = 0;
    $backBtn.display = true;
  };

  const showCountries = () => {
    $countries.forEach($country => {
      $country.style.opacity = 1;
    });
  };

  const hideCountryWithoutTarget = $target => {
    $countries.forEach($country => {
      if (!$country.style.transition) $country.style.transition = '1s';
      if ($country !== $target) $country.style.opacity = 0;
    });
  };

  const zoomCountry = $target => {
    const [targetCenterX, targetCenterY] = getCountryCenterPos($target);
    const scaleRatio = getScaleRatio($target);
    const moveX = HALF_MAP_WIDTH - targetCenterX * scaleRatio;
    const moveY = HALF_MAP_HEIGHT - targetCenterY * scaleRatio;

    translateAndScaleMap(moveX, moveY, scaleRatio);
    setTimeout(() => {
      hideCountryWithoutTarget($target);
    }, 1000);
    setTimeout(() => {
      showBackBtn();
      dropdownMenu.hideDropDownMenu();
      translateAndScaleMap(moveX - 230, moveY + 100, scaleRatio);
    }, 2000);
  };

  // event handlers
  $svg.onclick = e => {
    if (!(e.target.id in $serviceContry) || flag) return;
    flag = true;

    zoomCountry(e.target);
  };

  $backBtn.onclick = () => {
    flag = false;

    showCountries();
    hideBackBtn();

    setTimeout(() => {
      dropdownMenu.showDropDownMenu();
      translateAndScaleMap(0, 0, 1);
    }, 1000);
  };

  $customSelectBtn.onclick = () => {
    const country = document.querySelector('.custom-select-trigger > span').textContent;
    zoomCountry($serviceContry[country]);
  }
};
