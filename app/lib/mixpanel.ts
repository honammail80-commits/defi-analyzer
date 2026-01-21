"use client";

import mixpanel from "mixpanel-browser";

let isInitialized = false;

// Initialize Mixpanel
export const initMixpanel = () => {
  if (isInitialized) return;
  
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  
  if (token && typeof window !== "undefined") {
    try {
      mixpanel.init(token, {
        debug: process.env.NODE_ENV === "development",
        track_pageview: true,
        persistence: "localStorage",
      });
      isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Mixpanel:", error);
    }
  }
};

// Track custom events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!isInitialized || typeof window === "undefined") return;
  try {
    mixpanel.track(eventName, properties);
  } catch (error) {
    console.error("Failed to track event:", error);
  }
};

// Identify user
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (!isInitialized || typeof window === "undefined") return;
  try {
    mixpanel.identify(userId);
    if (properties) {
      mixpanel.people.set(properties);
    }
  } catch (error) {
    console.error("Failed to identify user:", error);
  }
};

export default mixpanel;
