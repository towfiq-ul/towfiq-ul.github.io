import {forwardRef, useRef, useState} from "react";
import type {FormEvent, KeyboardEvent} from "react";
import cx from "classnames";
import styles from "./terminal.module.css";
import session from "./session.module.css";
import {ARGUMENTS, COMMANDS} from "../../config/aliases";

interface PromptInputProps {
    busy: boolean;
    history: string[];
    onSubmit: (line: string) => void;
    onClear: () => void;
    /** Second Tab with several matches: print them, like bash. */
    onSuggest: (line: string, matches: string[]) => void;
}

function commonPrefix(words: string[]) {
    let prefix = words[0] ?? "";
    for (const w of words) while (!w.startsWith(prefix)) prefix = prefix.slice(0, -1);
    return prefix;
}

/** Candidates for the word under the cursor (command, or a command's argument). */
function complete(line: string) {
    const parts = line.replace(/^\s+/, "").split(/\s+/);
    if (parts.length <= 1) {
        const word = parts[0] ?? "";
        return {head: "", word, matches: COMMANDS.filter((c) => c.startsWith(word))};
    }
    const options = ARGUMENTS[parts[0].toLowerCase()] ?? [];
    const word = parts.at(-1) ?? "";
    const head = line.slice(0, line.length - word.length);
    return {head, word, matches: options.filter((o) => o.startsWith(word))};
}

/**
 * The agent-style input box: `>` prompt, Tab / Tab-Tab completion,
 * ↑↓ history, Ctrl+L clear.
 */
export const PromptInput = forwardRef<HTMLInputElement, PromptInputProps>(function PromptInput(
    {busy, history, onSubmit, onClear, onSuggest},
    ref,
) {
    const [value, setValue] = useState("");
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const lastKeyWasTab = useRef(false);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (busy || !value.trim()) return;
        onSubmit(value);
        setValue("");
        setHistoryIndex(null);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const wasTab = lastKeyWasTab.current;
        lastKeyWasTab.current = e.key === "Tab";

        if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            onClear();
            return;
        }

        if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            const {head, word, matches} = complete(value);
            if (matches.length === 1) {
                setValue(head + matches[0] + " ");
            } else if (matches.length > 1) {
                const prefix = commonPrefix(matches);
                if (prefix.length > word.length) setValue(head + prefix);
                else if (wasTab) onSuggest(value, matches);
            }
            return;
        }

        if (e.key === "ArrowUp" && history.length) {
            e.preventDefault();
            const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(next);
            setValue(history[next]);
        } else if (e.key === "ArrowDown" && historyIndex !== null) {
            e.preventDefault();
            const next = historyIndex + 1;
            if (next >= history.length) {
                setHistoryIndex(null);
                setValue("");
            } else {
                setHistoryIndex(next);
                setValue(history[next]);
            }
        }
    };

    return (
        <form onSubmit={submit} className={session.inputBox}>
            <label htmlFor="session-input" className={session.caret}>
                <span aria-hidden="true">&gt;</span>
                <span className="sr-only">Command or question</span>
            </label>
            <input
                id="session-input"
                ref={ref}
                className={session.input}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder='Try "help", press Tab Tab, or ask a question…'
            />
            <button type="submit" className={cx(styles.btn, session.run)} disabled={busy} aria-label="Run">↵</button>
        </form>
    );
});
