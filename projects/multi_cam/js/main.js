'use strict';

var VIDEO_WIDTH = 320;
var VIDEO_HEIGHT = 240;

function getSources(type) {
  if (typeof MediaStreamTrack.getSources === 'undefined') {
    return Promise.reject(
      'Your browser does not support getSources, aborting.');
  } else {
    var videoSources;
    return new Promise(function(resolve, reject) {
      MediaStreamTrack.getSources(function(sources) {
        videoSources = sources.filter(function(source) {
          return (source.kind === type);
        });
        resolve(videoSources);
      });
    });
  }
}

function requestVideo(id) {
  return new Promise(function(resolve, reject) {
    getUserMedia({
      video: {
        optional: [{ sourceId: id }],
        mandatory: {
          minWidth: VIDEO_WIDTH,
          minHeight: VIDEO_HEIGHT,
          maxWidth: VIDEO_WIDTH,
          maxHeight: VIDEO_HEIGHT
        }
      },
      audio: false
    }, resolve, function(error) {
      alert('User media request denied with error: ' + error.name);
      resolve(null);
    });
  });
}

window.onload = function() {
  getSources('video').then(function(sources) {
    return Promise.all(sources.map(function(source) {
      return requestVideo(source.id);
    }));
  }).then(function(videos) {
    var stage = document.querySelector('.stage');
    var defaultVideo = videos[0];
    var v1 = new VideoContainer(videos[0], {
      pos: 'left'
    });
    var v1p = new VideoContainer(videos[0], {
      pos: 'right',
      mirror: true
    });
    var v2 = new VideoContainer(videos[1] || defaultVideo, {
      pos: 'right'
    });
    var v2p = new VideoContainer(videos[1] || defaultVideo, {
      pos: 'left',
      mirror: true
    });
    var v3 = new VideoContainer(videos[2] || defaultVideo, {
      pos: 'left'
    });
    var v4 = new VideoContainer(videos[3] || defaultVideo, {
      pos: 'right'
    });

    stage.appendChild(v1.root);
    stage.appendChild(v1p.root);
    stage.appendChild(v2.root);
    stage.appendChild(v2p.root);
    stage.appendChild(v3.root);
    stage.appendChild(v4.root);

    var counter = 0;
    var steps = [
      function() {
        v1.show();
        v1p.show();
        v2.hide();
        v2p.hide();
        v3.hide();
        v4.hide();
      },
      function() {
        v2.show();
        v2p.show();
        v1.hide();
        v1p.hide();
        v3.hide();
        v4.hide();
      },
      function() {
        v3.show();
        v4.show();
        v1.hide();
        v1p.hide();
        v2.hide();
        v2p.hide();
      }
    ];

    setInterval(function() {
      steps[counter++]();
      if (counter === steps.length) {
        counter = 0;
      }
    }, 5000);
  }).catch(function(error) {
    console.error(error);
  });
};
