import {workExperience} from "../data/portfolio-data";
import {calculateExperience, calculateJobDurationYears} from "./date-utils";

export interface StatSlice {
    name: string;
    years: number;
}

const toYears = ({years, months}: { years: number; months: number }) => Number((years + months / 12).toFixed(1));

/**
 * Years per technology, measured from when each was first used professionally.
 */
export function calculateTechExperience(): StatSlice[] {
    const now = new Date();
    const phpStart = new Date(2016, 4);
    const dbStart = new Date(2018, 4);
    const devopsStart = new Date(2019, 8);
    const javaStart = new Date(2019, 11);
    const cloudStart = new Date(2020, 3);

    return [
        {name: "Java/Spring", years: toYears(calculateExperience(javaStart, now))},
        {name: "PHP/Laravel", years: toYears(calculateExperience(phpStart, javaStart))},
        {name: "Cloud/AWS", years: toYears(calculateExperience(cloudStart, now))},
        {name: "Databases", years: toYears(calculateExperience(dbStart, now))},
        {name: "DevOps", years: toYears(calculateExperience(devopsStart, now))},
    ];
}

function distribute(classify: (type: string) => string | null, order: string[]): StatSlice[] {
    const totals = new Map<string, number>();
    workExperience.forEach((job) => {
        const bucket = classify(job.type.toLowerCase());
        if (!bucket) return;
        totals.set(bucket, (totals.get(bucket) || 0) + calculateJobDurationYears(job.period));
    });
    return order
        .map((name) => ({name, years: Number((totals.get(name) || 0).toFixed(1))}))
        .filter((slice) => slice.years > 0);
}

export const calculateWorkTypeData = () =>
    distribute((type) => (type.includes("full-time") ? "Full-time" : type.includes("part-time") ? "Part-time" : null), [
        "Full-time",
        "Part-time",
    ]);

export const calculateLocationData = () =>
    distribute((type) => (type.includes("remote") ? "Remote" : type.includes("hybrid") ? "Hybrid" : "Physical"), [
        "Remote",
        "Hybrid",
        "Physical",
    ]);
