// Watch Tracking Service - Real-time video watch time tracking

import { trackWatchTime, markVideoCompleted } from './analyticsService';

class WatchTracker {
  constructor() {
    this.activeVideo = null;
    this.startTime = null;
    this.intervalId = null;
    this.accumulatedTime = 0;
    this.lastSaveTime = 0;
    this.saveInterval = 10; // Save every 10 seconds
  }

  // Start tracking a video
  startTracking(videoId, videoData) {
    // Stop any existing tracking
    this.stopTracking();

    this.activeVideo = {
      videoId,
      ...videoData,
      startedAt: new Date().toISOString()
    };
    this.startTime = Date.now();
    this.accumulatedTime = 0;
    this.lastSaveTime = 0;

    console.log('📹 Started tracking video:', videoId);

    // Start interval to track watch time
    this.intervalId = setInterval(() => {
      this.updateWatchTime();
    }, 1000); // Update every second
  }

  // Update watch time
  updateWatchTime() {
    if (!this.activeVideo || !this.startTime) return;

    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - this.startTime) / 1000);
    this.accumulatedTime = elapsedSeconds;

    // Save to analytics every saveInterval seconds
    if (elapsedSeconds - this.lastSaveTime >= this.saveInterval) {
      const timeToSave = elapsedSeconds - this.lastSaveTime;
      trackWatchTime(timeToSave);
      this.lastSaveTime = elapsedSeconds;
      console.log(`⏱️ Saved ${timeToSave}s watch time (Total: ${elapsedSeconds}s)`);
    }
  }

  // Stop tracking
  stopTracking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Save any remaining time
    if (this.activeVideo && this.accumulatedTime > this.lastSaveTime) {
      const remainingTime = this.accumulatedTime - this.lastSaveTime;
      trackWatchTime(remainingTime);
      console.log(`⏱️ Saved final ${remainingTime}s watch time`);
    }

    console.log('⏹️ Stopped tracking video');
    this.activeVideo = null;
    this.startTime = null;
    this.accumulatedTime = 0;
    this.lastSaveTime = 0;
  }

  // Pause tracking (when video is paused)
  pauseTracking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      
      // Save accumulated time
      if (this.accumulatedTime > this.lastSaveTime) {
        const timeToSave = this.accumulatedTime - this.lastSaveTime;
        trackWatchTime(timeToSave);
        this.lastSaveTime = this.accumulatedTime;
        console.log(`⏸️ Paused - Saved ${timeToSave}s watch time`);
      }
    }
  }

  // Resume tracking (when video is resumed)
  resumeTracking() {
    if (!this.activeVideo || this.intervalId) return;

    // Reset start time to current time
    this.startTime = Date.now() - (this.accumulatedTime * 1000);

    this.intervalId = setInterval(() => {
      this.updateWatchTime();
    }, 1000);

    console.log('▶️ Resumed tracking');
  }

  // Mark video as completed
  markCompleted() {
    if (this.activeVideo) {
      markVideoCompleted(this.activeVideo.videoId);
      console.log('✅ Video marked as completed');
    }
  }

  // Get current watch time
  getCurrentWatchTime() {
    return this.accumulatedTime;
  }

  // Get active video info
  getActiveVideo() {
    return this.activeVideo;
  }

  // Check if tracking is active
  isTracking() {
    return this.intervalId !== null;
  }
}

// Create singleton instance
const watchTracker = new WatchTracker();

// Export functions
export const startVideoTracking = (videoId, videoData) => {
  watchTracker.startTracking(videoId, videoData);
};

export const stopVideoTracking = () => {
  watchTracker.stopTracking();
};

export const pauseVideoTracking = () => {
  watchTracker.pauseTracking();
};

export const resumeVideoTracking = () => {
  watchTracker.resumeTracking();
};

export const markVideoAsCompleted = () => {
  watchTracker.markCompleted();
};

export const getCurrentWatchTime = () => {
  return watchTracker.getCurrentWatchTime();
};

export const getActiveVideo = () => {
  return watchTracker.getActiveVideo();
};

export const isVideoTracking = () => {
  return watchTracker.isTracking();
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    watchTracker.stopTracking();
  });
}

export default {
  startVideoTracking,
  stopVideoTracking,
  pauseVideoTracking,
  resumeVideoTracking,
  markVideoAsCompleted,
  getCurrentWatchTime,
  getActiveVideo,
  isVideoTracking
};

// Made with Bob