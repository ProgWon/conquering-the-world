// variables
const mapObject = document.querySelector('.map-object');

mapObject.onload = () => {
  const serviceCountries = ['KR', 'JP', 'US'];

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

  const hideOtherCountries = $target => {
    $countries.forEach($country => {
      $country.style.transition = '0.75s';
      if ($country !== $target) $country.style.opacity = 0;
    });
  };

  const zoomMap = $target => {
    const [targetCenterX, targetCenterY] = getCountryCenterPos($target);
    const moveX = mapWidth / 2 - targetCenterX;
    const moveY = mapHeight / 2 - targetCenterY;

    hideOtherCountries($target);
    $g.style.transition = '1s';
    $g.style.transform = `translate3D(${moveX}px, ${moveY}px, 0)`;
    // 여기부터 동건이 코드
    setTimeout(() => {
      $g.style.transform = `scale(2.75)`
    }, 2000)
  };

  // event handlers
  $svg.onclick = e => {
    if (!(e.target.id in $serviceCountries)) return;

    zoomMap(e.target);
  };
};
