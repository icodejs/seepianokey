export const getDevice = () => {
  if (window && window.localStorage) {
    const selectedDevice = localStorage.getItem('selectedDevice');
    return selectedDevice ? JSON.parse(selectedDevice) : {};
  }
  return null;
};

export const setDeviceName = name => {
  if (window && window.localStorage) {
    const device = getDevice();
    localStorage.setItem('selectedDevice', JSON.stringify({ ...device, name }));
  }
};

export const setDeviceOctaves = octaves => {
  if (window && window.localStorage) {
    const device = getDevice();
    localStorage.setItem(
      'selectedDevice',
      JSON.stringify({ ...device, octaves }),
    );
  }
};
