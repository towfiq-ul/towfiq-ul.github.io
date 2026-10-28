/**
 * The portfolio's "~/.bash_aliases": each alias is a Home-page section.
 * The file tree, the typed command above each section, and the agent prompt's
 * commands all read from this list — add a section here to register it.
 */
export interface SectionAlias {
    alias: string;
    expands: string;
    sectionId: string;
    file: string;
}

export const SECTION_ALIASES: SectionAlias[] = [
    {alias: "about", expands: "cat overview.md", sectionId: "overview", file: "overview.md"},
    {alias: "skills", expands: "tree skills/ && ./chart.sh", sectionId: "skills", file: "skills/"},
    {alias: "work", expands: "git log --author=towfiq", sectionId: "experience", file: "experience.log"},
    {alias: "projects", expands: "ls -la projects/", sectionId: "project", file: "projects/"},
    {alias: "blog", expands: "curl -s medium.com/@towfiq106 | jq", sectionId: "writing", file: "writing/"},
    {alias: "edu", expands: "cat education.yml", sectionId: "education", file: "education.yml"},
    {alias: "awards", expands: "cat awards.txt", sectionId: "awards", file: "awards.txt"},
    {alias: "oss", expands: "gh repo list --contributions", sectionId: "open-source", file: "open-source/"},
    {alias: "certs", expands: "cat certs.json", sectionId: "certifications", file: "certs.json"},
    {alias: "hireme", expands: "./connect.sh", sectionId: "contact", file: "connect.sh"},
];

export const CV_ALIAS = {alias: "cv", expands: "less cv.md"};

export const aliasFor = (sectionId: string) => SECTION_ALIASES.find((a) => a.sectionId === sectionId)!;

/** Every command the prompt knows, in portfolio order — drives the "try" chips and Tab completion. */
export const COMMANDS = [
    "whoami",
    ...SECTION_ALIASES.map((a) => a.alias),
    CV_ALIAS.alias,
    "mail",
    "whatsapp",
    "sidebar",
    "theme",
    "alias",
    "help",
    "history",
    "clear",
    // plain bash
    "ls",
    "pwd",
    "cd",
    "cat",
    "less",
    "echo",
    "date",
    "type",
    "ask",
];

/** Files `cd` / `cat` / `less` accept (Tab-completable). */
export const FILES = ["whoami.sh", ...SECTION_ALIASES.map((a) => a.file), "cv.md"];

/** Second-word completions per command. */
export const ARGUMENTS: Record<string, string[]> = {
    cd: FILES,
    cat: FILES,
    less: FILES,
    sidebar: ["enable", "disable"],
    type: [...SECTION_ALIASES.map((a) => a.alias), CV_ALIAS.alias],
};
