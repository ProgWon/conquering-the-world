// variables
const mapObject = document.querySelector('.map-object');
const serviceCountries = ['KR', 'JP', 'US'];

const controlSearchForm = (() => {
  const $searchForm = document.querySelector('.custom-select-wrapper');

  return {
    showSearchFrom() {
      $searchForm.style.transition = '0.5s';
      $searchForm.style.display = 'flex';
      $searchForm.style.opacity = 1;
    },
    hideSearchForm() {
      $searchForm.style.transition = '0.5s';
      $searchForm.style.display = 'none';
      $searchForm.style.opacity = 0;
    }
  };
})();

mapObject.onload = () => {
  const mapWidth = mapObject.clientWidth;
  const mapHeight = mapObject.clientHeight;

  const $svg = mapObject.contentDocument.querySelector('svg');
  const $g = $svg.querySelector('g');
  const $countries = [...$g.children];
  const $serviceCountries = serviceCountries.reduce((obj, key) => {
    obj[key] = $svg.getElementById(key);
    return obj;
  }, {});

  // variables
  let flag = false;

  // functions
  const controlBackBtn = (() => {
    const $backBtn = document.querySelector('.back-btn');

    return {
      showBackBtn() {
        $backBtn.style.display = 'block';
      },
      hideBackBtn() {
        $backBtn.style.display = 'none';
      }
    };
  })();

  const getCountryCenterPos = $target => {
    const rect = $target.getBoundingClientRect();
    return [rect.width / 2 + rect.x, rect.height / 2 + rect.y];
  };

  const getZoomRatio = $target => {
    const rectWidth = $target.getBoundingClientRect().width;
    return rectWidth < 50 ? 25 : rectWidth < 200 ? 5 : 2;
  };

  const showCountries = () => {
    $countries.forEach($country => {
      $country.style.opacity = 1;
    });
  };

  const hideOtherCountries = $target => {
    $countries.forEach($country => {
      $country.style.transition = '0.5s';
      if ($country !== $target) $country.style.opacity = 0;
    });
  };

  const zoomMap = $target => {
    const [targetCenterX, targetCenterY] = getCountryCenterPos($target);
    const zoomRatio = getZoomRatio($target);
    const moveX = mapWidth / 2 - targetCenterX * zoomRatio;
    const moveY = mapHeight / 2 - targetCenterY * zoomRatio;

    $g.style.transition = '1s';
    $g.style.transform = `translate3D(${moveX}px, ${moveY}px, 0) scale(${zoomRatio})`;

    controlSearchForm.hideSearchForm();

    setTimeout(() => {
      hideOtherCountries($target);
    }, 1000);
    setTimeout(() => {
      $g.style.transition = '0.5s';
      $g.style.transform = `translate3D(${moveX - 230}px, ${
        moveY + 100
      }px, 0) scale(${zoomRatio})`;
      controlBackBtn.showBackBtn();
    }, 2000);
  };

  // event handlers
  $svg.onclick = e => {
    if (!(e.target.id in $serviceCountries) || flag) return;

    zoomMap(e.target);
    flag = true;
  };

  document.querySelector('.back-btn').onclick = () => {
    showCountries();
    $g.style.transform = `translate3D(0, 0, 0) scale(1)`;
    flag = false;

    setTimeout(() => {
      controlBackBtn.hideBackBtn();
      controlSearchForm.showSearchFrom();
    }, 1000);
  };

  document.querySelector('.custom-select-btn').onclick = e => {
    e.preventDefault();
    zoomMap($serviceCountries[document.querySelector('.custom-select-trigger > span').textContent]);
  };
};

// dropdown menu
document
  .querySelector('.custom-select-wrapper')
  .addEventListener('click', function () {
    this.querySelector('.custom-select').classList.toggle('open');
  });

document
  .querySelector('.custom-select-wrapper')
  .addEventListener('keyup', e => {
    if (!(e.key === 'Enter')) return;
    document.querySelector('.custom-select').classList.toggle('open');
  });

for (const option of document.querySelectorAll('.custom-option')) {
  option.addEventListener('click', function () {
    if (!this.classList.contains('selected')) {
      this.parentNode
        .querySelector('.custom-option.selected')
        .classList.remove('selected');
      this.classList.add('selected');
      this.closest('.custom-select').querySelector(
        '.custom-select-trigger span'
      ).textContent = this.textContent;
    }
  });
}

window.addEventListener('click', e => {
  const select = document.querySelector('.custom-select');
  if (!select.contains(e.target)) {
    select.classList.remove('open');
  }
});
