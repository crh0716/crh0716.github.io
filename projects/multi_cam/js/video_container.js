'use strict';

function VideoContainer(stream, options) {
  this._root = document.createElement('div');
  this._root.className = 'video-container';

  this._video = document.createElement('video');
  this._video.autoplay = true;

  this.setPosition((options && options.pos) || 'left');
  this.setMirror((options && options.mirror) || false);
  if (options && options.visible) {
    this.show();
  }
  this.setSize(1024, 768);

  this._root.appendChild(this._video);
  this.setStream(stream);
}

VideoContainer.prototype = {
  get root() {
    return this._root;
  }
};

VideoContainer.prototype.setStream = function(stream) {
  attachMediaStream(this._video, stream);
};

VideoContainer.prototype.setPosition = function(pos) {
  this._root.dataset.pos = pos;
};

VideoContainer.prototype.setSize = function(width, height) {
  this._video.width = width;
  this._video.height = height;
};

VideoContainer.prototype.setMirror = function(mirror) {
  if (mirror) {
    this._root.classList.add('mirror');
  } else {
    this._root.classList.remove('mirror');
  }
}

VideoContainer.prototype.show = function() {
  this._root.classList.add('show');
};

VideoContainer.prototype.hide = function() {
  this._root.classList.remove('show');
};
