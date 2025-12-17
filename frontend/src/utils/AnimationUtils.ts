import * as THREE from 'three';

/**
 * Clamps the delta time to a maximum value to prevent large jumps during lag spikes.
 * @param delta The raw delta time from the frame loop.
 * @param maxDelta The maximum allowed delta time (default: 0.1s = 100ms or ~10fps).
 * @returns The clamped delta time.
 */
export const clampDelta = (delta: number, maxDelta = 0.1): number => {
    return Math.min(delta, maxDelta);
};

/**
 * Smoothly interpolates a number using damp function (framerate independent).
 * @param current Current value
 * @param target Target value
 * @param smoothTime Approximate time to reach target
 * @param delta Time step
 * @returns New value
 */
export const smoothDamp = (current: number, target: number, smoothTime: number, delta: number): number => {
    const draggingSmoothTime = smoothTime;
    // Simple lerp-based damping for now, can be upgraded to Spring if needed
    // Using a simple exponential decay:
    // val += (target - val) * (1 - exp(-lambda * dt))
    // lambda ≈ 4 / smoothTime for 98% settlement
    const lambda = 4 / Math.max(0.0001, smoothTime);
    return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta));
};
