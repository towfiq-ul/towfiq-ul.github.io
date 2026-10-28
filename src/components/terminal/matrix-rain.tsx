import {useEffect, useRef} from "react";

const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789{}[]<>/=+*$#";
const FONT_SIZE = 16;
const FRAME_MS = 50; // ~20fps is plenty for rain and keeps the CPU quiet

/**
 * Matrix-style code rain behind the terminal, in the theme's `--t-rain` color.
 * A fixed full-viewport canvas (never moves with scrolling); pauses while the
 * tab is hidden and renders a single still frame for reduced-motion users.
 */
export function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        let drops: number[] = [];
        let color = "#5fc4b6";
        let fade = "rgba(12, 24, 29, 0.12)";
        let frame = 0;
        let last = 0;

        const readTheme = () => {
            const styles = getComputedStyle(document.documentElement);
            color = styles.getPropertyValue("--t-rain").trim() || color;
            const page = styles.getPropertyValue("--t-page").trim() || "#0c181d";
            fade = hexToRgba(page, 0.12);
            ctx.fillStyle = page;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        const resize = () => {
            const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(globalThis.innerWidth * dpr);
            canvas.height = Math.floor(globalThis.innerHeight * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const columns = Math.ceil(globalThis.innerWidth / FONT_SIZE);
            drops = Array.from({length: columns}, () => Math.random() * -50);
            readTheme();
        };

        const draw = () => {
            ctx.fillStyle = fade;
            ctx.fillRect(0, 0, globalThis.innerWidth, globalThis.innerHeight);
            ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
            for (let i = 0; i < drops.length; i++) {
                const y = drops[i] * FONT_SIZE;
                ctx.fillStyle = color;
                ctx.globalAlpha = Math.random() > 0.96 ? 0.9 : 0.45;
                ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], i * FONT_SIZE, y);
                if (y > globalThis.innerHeight && Math.random() > 0.975) drops[i] = 0;
                drops[i] += 1;
            }
            ctx.globalAlpha = 1;
        };

        const loop = (ts: number) => {
            frame = requestAnimationFrame(loop);
            if (document.hidden || ts - last < FRAME_MS) return;
            last = ts;
            draw();
        };

        resize();
        if (reducedMotion) {
            for (let i = 0; i < 60; i++) draw();
        } else {
            frame = requestAnimationFrame(loop);
        }

        // Re-read colors when the theme toggles (useColorScheme swaps html's class).
        const themeObserver = new MutationObserver(readTheme);
        themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ["class"]});
        globalThis.addEventListener?.("resize", resize);

        return () => {
            cancelAnimationFrame(frame);
            themeObserver.disconnect();
            globalThis.removeEventListener?.("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.55}}
        />
    );
}

function hexToRgba(hex: string, alpha: number) {
    const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return `rgba(12, 24, 29, ${alpha})`;
    return `rgba(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}, ${alpha})`;
}
