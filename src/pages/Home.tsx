import {lazy, Suspense, useEffect, useLayoutEffect, useRef, useState} from "react";
import type {ReactNode} from "react";
import cx from "classnames";
import Markdown from "react-markdown";
import styles from "../components/terminal/terminal.module.css";
import session from "../components/terminal/session.module.css";
import {PromptPrefix, TerminalWindow} from "../components/terminal/terminal-window";
import {FileTree} from "../components/terminal/file-tree";
import {PromptInput} from "../components/terminal/prompt-input";
import {Hero} from "../components/sections/hero";
import {Overview} from "../components/sections/overview";
import {Skills} from "../components/sections/skills";
import {Experience} from "../components/sections/experience";
import {Projects} from "../components/sections/projects";
import {Awards, Certifications, Education, OpenSource, Writing} from "../components/sections/records";
import {Connect} from "../components/sections/connect";
import {openWhatsApp, WhatsApp} from "../components/sections/whatsapp";
import {GREETING, NO_BUTTON_TEXT, useAssistant, YES_BUTTON_TEXT} from "../components/ai/use-assistant";
import type {AssistantReply} from "../components/ai/use-assistant";
import {CV_ALIAS, FILES, SECTION_ALIASES} from "../config/aliases";
import {downloadCV, TRIGGER_DOWNLOAD_CV, TRIGGER_EMAIL_ME, TRIGGER_TOGGLE_THEME, TRIGGER_WHATSAPP_ME} from "../config/helper";

// Loaded on first use: the CV pager and the mail form (EmailJS) stay out of the initial bundle.
const CvPager = lazy(() => import("../components/terminal/cv-pager").then((m) => ({default: m.CvPager})));
const MailForm = lazy(() => import("../components/sections/mail-form").then((m) => ({default: m.MailForm})));

type SectionKey = "hero" | "mail" | "whatsapp" | (typeof SECTION_ALIASES)[number]["sectionId"];

type Entry =
    | { id: number; kind: "login" }
    | { id: number; kind: "cmd"; text: string }
    | { id: number; kind: "section"; section: SectionKey }
    | { id: number; kind: "text" | "err" | "agent" | "tool"; text: string }
    | { id: number; kind: "suggest"; items: string[] };

type NewEntry = Entry extends infer E ? (E extends Entry ? Omit<E, "id"> : never) : never;

/** "try" chips: every command, in portfolio order. */
const CONFIRM_PROMPTS: Record<string, string> = {
    [TRIGGER_EMAIL_ME]: "Open the email form?",
    [TRIGGER_WHATSAPP_ME]: "Start a WhatsApp chat?",
    [TRIGGER_DOWNLOAD_CV]: "Download the CV (PDF)?",
};
const CHIPS = ["whoami", ...SECTION_ALIASES.map((a) => a.alias), CV_ALIAS.alias, "mail", "whatsapp", "theme", "alias", "help"];


const HELP_TEXT = [
    "portfolio (~/.bash_aliases):",
    "  whoami · " + SECTION_ALIASES.map((a) => a.alias).join(" · "),
    "  cv (less cv.md) · mail · whatsapp",
    "terminal:",
    "  sidebar enable|disable · theme · alias · type <alias> · history · clear (ctrl+l)",
    "  ls · pwd · cd <file> · cat <file> · less <file> · echo · date",
    "agent:",
    "  ask <question> — or type any question (e.g. ending in ?)",
    "keys: tab complete · tab tab list · ↑↓ history · ctrl+l clear",
].join("\n");

const ALIAS_SECTIONS: Record<string, SectionKey> = {
    whoami: "hero",
    ...Object.fromEntries(SECTION_ALIASES.map((a) => [a.alias, a.sectionId])),
};

const FILE_SECTIONS: Record<string, SectionKey> = {
    "whoami.sh": "hero",
    ...Object.fromEntries(SECTION_ALIASES.map((a) => [a.file.replace(/\/$/, ""), a.sectionId])),
};

const QUESTION_WORDS = new Set([
    "what", "who", "whom", "whose", "how", "why", "when", "where", "which",
    "is", "are", "was", "were", "does", "do", "did", "can", "could", "would", "will", "should", "has", "have",
    "tell", "explain", "describe", "summarize", "summarise", "give", "hi", "hello", "hey",
]);

/** Only natural-language questions reach the agent; shell-looking input gets bash's answer. */
const isQuestion = (line: string) => {
    const words = line.trim().split(/\s+/);
    return line.trim().endsWith("?") || QUESTION_WORDS.has(words[0].toLowerCase()) || words.length >= 4;
};

const INITIAL: NewEntry[] = [{kind: "login"}, {kind: "cmd", text: "whoami"}, {kind: "section", section: "hero"}];

function Loading() {
    return <div className={cx(styles.muted, styles.spinner)}>loading…</div>;
}

function lastLogin(d = new Date()) {
    return d.toLocaleString("en-US", {weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false});
}

/**
 * The site: one bash session. It opens with `whoami`; every command prints its
 * section (or answer) into the scrollback, and the newest command's output
 * takes over the screen. `clear` / Ctrl+L wipes everything.
 */
export default function Home() {
    const assistant = useAssistant();
    const nextId = useRef(0);
    const withIds = (items: NewEntry[]) => items.map((item) => ({...item, id: nextId.current++}) as Entry);

    const [entries, setEntries] = useState<Entry[]>(() => withIds(INITIAL));
    const [history, setHistory] = useState<string[]>([]);
    const [sidebar, setSidebar] = useState(false);
    const [pagerOpen, setPagerOpen] = useState(false);
    const [viewport, setViewport] = useState(0);
    const scrollTo = useRef<number | null>(null);
    const mainRef = useRef<HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const push = (...items: NewEntry[]) => {
        const added = withIds(items);
        setEntries((prev) => [...prev, ...added]);
    };
    const clear = () => setEntries([]);

    const pushReply = (reply: AssistantReply | null) => {
        if (!reply) return;
        if (reply.sources.length) push({kind: "tool", text: `⎿  searched portfolio: ${reply.sources.join(" · ")}`});
        push({kind: "agent", text: reply.text});
    };

    const ask = async (question: string) => pushReply(await assistant.send(question));

    const openPager = () => setPagerOpen(true);

    const exec = (raw: string) => {
        const line = raw.trim();
        if (!line) return;
        const [first, ...restParts] = line.split(/\s+/);
        const cmd = first.toLowerCase();
        const rest = restParts.join(" ");
        const file = rest.replace(/^\.?\/|\/$/g, "");

        if (cmd === "clear") {
            clear();
            return;
        }
        if (pagerOpen && cmd !== CV_ALIAS.alias) setPagerOpen(false);

        setHistory((prev) => [...prev, line].slice(-100));
        const id = nextId.current;
        scrollTo.current = id;
        const out: NewEntry[] = [{kind: "cmd", text: line}];

        if (cmd === "ask") {
            push(...out);
            if (rest) ask(rest).then();
            else push({kind: "err", text: "usage: ask <question>"});
            return;
        }

        if (ALIAS_SECTIONS[cmd] && !rest) {
            out.push({kind: "section", section: ALIAS_SECTIONS[cmd]});
        } else if (cmd === CV_ALIAS.alias || ((cmd === "less" || cmd === "cat") && file === "cv.md")) {
            openPager();
        } else if (cmd === "mail") {
            out.push({kind: "section", section: "mail"});
        } else if (cmd === "whatsapp") {
            openWhatsApp();
            out.push({kind: "section", section: "whatsapp"});
        } else if (cmd === "sidebar") {
            const arg = rest.toLowerCase();
            if (/^(enable|enabled|on|show)$/.test(arg)) {
                setSidebar(true);
                out.push({kind: "text", text: "sidebar: enabled"});
            } else if (/^(disable|disabled|off|hide)$/.test(arg)) {
                setSidebar(false);
                out.push({kind: "text", text: "sidebar: disabled"});
            } else {
                out.push({kind: "text", text: `sidebar: ${sidebar ? "enabled" : "disabled"}\nusage: sidebar enable|disable`});
            }
        } else if (cmd === "theme") {
            globalThis.dispatchEvent?.(new CustomEvent(TRIGGER_TOGGLE_THEME));
            out.push({kind: "text", text: "theme switched"});
        } else if (cmd === "help") {
            out.push({kind: "text", text: HELP_TEXT});
        } else if (cmd === "alias") {
            out.push({kind: "text", text: [...SECTION_ALIASES, CV_ALIAS].map((a) => `alias ${a.alias}='${a.expands}'`).join("\n")});
        } else if (cmd === "type" && rest) {
            const hit = [...SECTION_ALIASES, CV_ALIAS].find((a) => a.alias === rest);
            out.push(hit ? {kind: "text", text: `${rest} is aliased to \`${hit.expands}'`} : {kind: "err", text: `bash: type: ${rest}: not found`});
        } else if (cmd === "history") {
            const lines = [...history, line];
            out.push({kind: "text", text: lines.map((c, i) => `${String(i + 1).padStart(4)}  ${c}`).join("\n")});
        } else if (cmd === "ls" || cmd === "ll" || cmd === "tree") {
            out.push({kind: "text", text: FILES.join("  ")});
        } else if (cmd === "pwd") {
            out.push({kind: "text", text: "/home/towfiq/portfolio"});
        } else if (cmd === "date") {
            out.push({kind: "text", text: new Date().toString()});
        } else if (cmd === "echo") {
            out.push({kind: "text", text: rest});
        } else if ((cmd === "cd" || cmd === "cat" || cmd === "less") && rest) {
            if (FILE_SECTIONS[file]) out.push({kind: "section", section: FILE_SECTIONS[file]});
            else out.push({kind: "err", text: `bash: ${cmd}: ${rest}: No such file or directory`});
        } else if (cmd === "cd") {
            // `cd` alone: home, nothing printed — like bash.
        } else if (isQuestion(line)) {
            push(...out);
            ask(line).then();
            return;
        } else {
            out.push({kind: "err", text: `bash: ${first}: command not found`}, {kind: "text", text: "hint: help lists commands · ask <question> talks to towfiq-agent"});
        }
        push(...out);
    };

    // Latest exec for listeners registered once.
    const execRef = useRef(exec);
    execRef.current = exec;

    const confirm = async (yes: boolean) => {
        push({kind: "cmd", text: yes ? YES_BUTTON_TEXT : NO_BUTTON_TEXT});
        pushReply(await assistant.confirmAction(yes));
    };

    // The newest command's output takes over the screen: size the last group to
    // the viewport and scroll the command line to the top.
    useEffect(() => {
        const main = mainRef.current;
        if (!main) return;
        const observer = new ResizeObserver(() => setViewport(main.clientHeight));
        observer.observe(main);
        return () => observer.disconnect();
    }, []);

    useLayoutEffect(() => {
        const main = mainRef.current;
        const id = scrollTo.current;
        if (!main || id === null) return;
        const el = main.querySelector<HTMLElement>(`[data-entry="${id}"]`);
        if (!el) return;
        scrollTo.current = null;
        main.scrollTo({top: el.offsetTop - 16, behavior: "smooth"});
    }, [entries]);

    // Global keys: Ctrl+L clears; typing anywhere outside a field goes to the prompt.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            const inField = target?.closest("input, textarea, select, [contenteditable='true']");
            if (pagerOpen) {
                // `less`: q / Esc quits even when focus isn't inside the pager.
                if (!e.defaultPrevented && !inField && (e.key === "q" || e.key === "Escape")) {
                    e.preventDefault();
                    closePager();
                }
                return;
            }
            if (e.ctrlKey && e.key.toLowerCase() === "l") {
                e.preventDefault();
                setEntries([]);
                return;
            }
            if (!inField && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
                inputRef.current?.focus();
            }
        };
        globalThis.addEventListener?.("keydown", onKey);
        return () => globalThis.removeEventListener?.("keydown", onKey);
    }, [pagerOpen]);

    // The AI assistant can hand off to the mail form, WhatsApp or the CV download (RULESET action tokens).
    useEffect(() => {
        const emailMe = () => execRef.current("mail");
        const whatsAppMe = () => execRef.current("whatsapp");
        globalThis.addEventListener?.(TRIGGER_EMAIL_ME, emailMe);
        globalThis.addEventListener?.(TRIGGER_WHATSAPP_ME, whatsAppMe);
        globalThis.addEventListener?.(TRIGGER_DOWNLOAD_CV, downloadCV);
        return () => {
            globalThis.removeEventListener?.(TRIGGER_EMAIL_ME, emailMe);
            globalThis.removeEventListener?.(TRIGGER_WHATSAPP_ME, whatsAppMe);
            globalThis.removeEventListener?.(TRIGGER_DOWNLOAD_CV, downloadCV);
        };
    }, []);

    const closePager = () => {
        setPagerOpen(false);
        requestAnimationFrame(() => inputRef.current?.focus());
    };

    const renderSection = (section: SectionKey): ReactNode => {
        const run = (command: string) => exec(command);
        switch (section) {
            case "hero":
                return <Hero onRun={run}/>;
            case "overview":
                return <Overview/>;
            case "skills":
                return <Skills/>;
            case "experience":
                return <Experience/>;
            case "project":
                return <Projects/>;
            case "writing":
                return <Writing/>;
            case "education":
                return <Education/>;
            case "awards":
                return <Awards/>;
            case "open-source":
                return <OpenSource/>;
            case "certifications":
                return <Certifications/>;
            case "contact":
                return <Connect onEmailMe={() => exec("mail")}/>;
            case "mail":
                return <Suspense fallback={<Loading/>}><MailForm/></Suspense>;
            case "whatsapp":
                return <WhatsApp/>;
        }
    };

    const renderEntry = (entry: Entry): ReactNode => {
        switch (entry.kind) {
            case "login":
                return <div className={session.text}>Last login: {lastLogin()} on pts/0</div>;
            case "cmd":
                return <div className={session.cmdLine}><PromptPrefix/> {entry.text}</div>;
            case "section":
                return renderSection(entry.section);
            case "text":
                return <div className={session.text}>{entry.text}</div>;
            case "err":
                return <div className={session.err}>{entry.text}</div>;
            case "tool":
                return <div className={session.tool}>{entry.text}</div>;
            case "agent":
                return (
                    <div className={session.agent}>
                        <span className={session.agentDot} aria-hidden="true">●</span>
                        <div className={session.markdown}><Markdown>{entry.text}</Markdown></div>
                    </div>
                );
            case "suggest":
                return <div className={session.suggestions}>{entry.items.map((item) => <span key={item}>{item}</span>)}</div>;
        }
    };

    // Group the scrollback by command: each group is a command and its output.
    const groups: Entry[][] = [];
    for (const entry of entries) {
        if (entry.kind === "cmd" || groups.length === 0) groups.push([entry]);
        else groups[groups.length - 1].push(entry);
    }
    const lastSection = [...entries].reverse().find((e) => e.kind === "section");
    const activeSection = lastSection?.kind === "section" ? lastSection.section : null;

    const footer = (
        <div className={session.footer}>
            <div className={session.chips} role="group" aria-label="Commands">
                <span className={styles.muted}>try:</span>
                {CHIPS.map((chip) => (
                    <button key={chip} type="button" className={cx(styles.btn, session.chip)} onClick={() => exec(chip)}>{chip}</button>
                ))}
                <button type="button" className={cx(styles.btn, session.chip)} onClick={() => exec(`sidebar ${sidebar ? "disable" : "enable"}`)}>
                    sidebar {sidebar ? "disable" : "enable"}
                </button>
                <button type="button" className={cx(styles.btn, session.chip, session.chipClear)} onClick={clear}>clear</button>
            </div>
            <PromptInput
                ref={inputRef}
                busy={assistant.isLoading}
                history={history}
                onSubmit={exec}
                onClear={clear}
                onSuggest={(line, matches) => push({kind: "cmd", text: line}, {kind: "suggest", items: matches})}
            />
            <div className={session.hints}>
                <span><span className={styles.c1}>towfiq-agent</span> {GREETING.content.replace(/^Hi! /, "")}</span>
                <span className={session.hintKeys}>tab complete · ↑↓ history · ctrl+l clear · agent {assistant.isConnected ? "online" : "offline"}</span>
            </div>
        </div>
    );

    return (
        <>
            <TerminalWindow
                title="towfiq@portfolio: ~ — bash"
                mainRef={mainRef}
                sidebar={sidebar ? <FileTree activeSection={activeSection} onRun={exec}/> : undefined}
                footer={footer}
                overlay={pagerOpen ? <Suspense fallback={<Loading/>}><CvPager onQuit={closePager}/></Suspense> : undefined}
            >
                {groups.length === 0 && (
                    // After `clear`: an empty prompt with a blinking cursor, like bash.
                    <div className={session.cmdLine}>
                        <PromptPrefix/><span className={styles.cursor} aria-hidden="true"/>
                    </div>
                )}
                {groups.map((group, i) => (
                    <div
                        key={group[0].id}
                        className={session.group}
                        style={i === groups.length - 1 ? {minHeight: viewport ? viewport - 40 : undefined} : undefined}
                    >
                        {group.map((entry) => (
                            <div key={entry.id} data-entry={entry.id}>{renderEntry(entry)}</div>
                        ))}
                        {i === groups.length - 1 && assistant.isLoading && (
                            <div className={cx(session.thinking, styles.spinner)}>Searching portfolio &amp; thinking…</div>
                        )}
                        {i === groups.length - 1 && assistant.pendingAction && !assistant.isLoading && (
                            <div className={session.confirm}>
                                <span>? {CONFIRM_PROMPTS[assistant.pendingAction] ?? "Continue?"}</span>
                                <button type="button" className={cx(styles.btn, styles.btnAccent)} onClick={() => confirm(true)}>{YES_BUTTON_TEXT}</button>
                                <button type="button" className={styles.btn} onClick={() => confirm(false)}>{NO_BUTTON_TEXT}</button>
                            </div>
                        )}
                    </div>
                ))}
            </TerminalWindow>

        </>
    );
}
