const USER_MEDIA = {
  /**
   *
   * @param {MediaStreamConstraints} constraints
   * @returns {Promise<MediaStream | DOMException>}
   */
  asyncUserMedias: async (constraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
  },

  _permissions: {
    video: false,
    audio: false,
  },

  _devices: [],

  devices() {
    const config = USER_MEDIA._devices;

    return config;
  },

  _cameras: [],

  cameras(name) {
    if (USER_MEDIA._permissions.video) {
      const config = USER_MEDIA._cameras;

      if (name === "default") {
        return config[0];
      }

      return config;
    }
    return [];
  },

  _microphones: [],

  microphones(name) {
    if (USER_MEDIA._permissions.audio) {
      const config = USER_MEDIA._microphones;

      if (name === "default") {
        return config[0];
      }

      return config;
    }

    return [];
  },

  /**
   *
   * @param {MediaStreamConstraints} constraints
   * @returns {Promise<InputDeviceInfo[]> | Promise<DOMException>}
   */
  asyncPermissionToUseUserMedia: async (constraints) => {
    try {
      const media = await USER_MEDIA.asyncUserMedias(constraints);

      USER_MEDIA._permissions.audio = true;

      const videos = media.getVideoTracks();
      if (0 < videos.length) {
        USER_MEDIA._permissions.video = true;
        videos.forEach((video) => video.stop());
      }

      const audios = media.getAudioTracks();
      if (0 < audios.length) {
        USER_MEDIA._permissions.audio = true;
        audios.forEach((audio) => audio.stop());
      }

      const devices = await USER_MEDIA.asyncDevices();

      USER_MEDIA._devices = devices;

      USER_MEDIA._cameras = devices.filter(
        (device) => device.kind === "videoinput" && device.label !== ""
      );

      USER_MEDIA._microphones = devices.filter(
        (device) => device.kind === "audioinput" && device.label !== ""
      );

      return Promise.resolve(devices);
    } catch (err) {
      USER_MEDIA._permissions.video = false;
      USER_MEDIA._permissions.audio = false;

      return Promise.reject(err);
    }
  },

  /**
   *
   * @returns {Promise<Array>} devices
   */
  asyncDevices: async () => {
    return await navigator.mediaDevices.enumerateDevices();
  },
};

export default USER_MEDIA;
