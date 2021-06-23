// variables
const mapObject = document.querySelector('.map-object');
const serviceCountries = ['KR', 'JP', 'US'];

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

  // functions
  const getCountryCenterPos = $target => {
    const rect = $target.getBoundingClientRect();
    return [rect.width / 2 + rect.x, rect.height / 2 + rect.y];
  };

  const getZoomRatio = $target => {
    const rectWidth = $target.getBoundingClientRect().width;
    return rectWidth < 50 ? 25 : rectWidth < 200 ? 5 : 2;
  }

  const hideOtherCountries = $target => {
    $countries.forEach($country => {
      $country.style.transition = '0.75s';
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

    setTimeout(() => {
      hideOtherCountries($target);
    }, 1000);
  };

  document.querySelector('.search-form').onsubmit = e => {
    e.preventDefault();
    zoomMap($serviceCountries[e.target.querySelector('.country-list').value]);
  }

  // event handlers
  $svg.onclick = e => {
    if (!(e.target.id in $serviceCountries)) return;

    zoomMap(e.target);
  };
};
