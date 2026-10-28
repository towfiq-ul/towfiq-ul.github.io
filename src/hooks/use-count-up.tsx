import {useEffect, useState} from "react";

/**
 * Animates 0 → 1 with an ease-out curve; multiply targets by the returned progress.
 * Jumps straight to 1 when the user prefers reduced motion.
 */
export function useCountUp(duration = 1600) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            setProgress(1);
            return;
        }
        let frame = 0;
        let start: number | null = null;
        const step = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min(1, (ts - start) / duration);
            setProgress(1 - Math.pow(1 - p, 3));
            if (p < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [duration]);

    return progress;
}
