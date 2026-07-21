/**
 * Calculate the difference between two dates in years and months
 */
export function calculateExperience(startDate: Date, endDate: Date = new Date()) {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    return {years, months};
}

/**
 * Parse a date string in format "Month YYYY" or "Current"
 */
export function parseExperienceDate(dateStr: string): Date {
    if (dateStr.toLowerCase() === "current") {
        return new Date();
    }

    const [month, year] = dateStr.split(" ");
    const monthMap: { [key: string]: number } = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
    };

    const monthIndex = monthMap[month.toLowerCase()];
    return new Date(parseInt(year), monthIndex);
}

/**
 * Calculate total experience from work history
 */
export function calculateTotalExperience(
    workHistory: Array<{ period: string }>
): { years: number; months: number; formatted: string } {
    let totalMonths = 0;

    workHistory.forEach((job) => {
        const [start, end] = job.period.split(" - ");
        const startDate = parseExperienceDate(start);
        const endDate = parseExperienceDate(end);

        const exp = calculateExperience(startDate, endDate);
        totalMonths += exp.years * 12 + exp.months;
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const formatted = months > 0 ? `${years} yr ${months} mo` : `${years} yr`;

    return {years, months, formatted};
}

/**
 * Format experience for display
 */
export function formatExperience(years: number, months: number): string {
    if (months === 0) {
        return `${years} Year${years !== 1 ? "s" : ""}`;
    }
    return `${years} Year${years !== 1 ? "s" : ""} ${months} Month${months !== 1 ? "s" : ""}`;
}

/**
 * Format experience in short form (e.g., "6 yr 3 mo")
 */
export function formatExperienceShort(years: number, months: number): string {
    if (months === 0) {
        return `${years} yr`;
    }
    return `${years} yr ${months} mo`;
}

/**
 * Duration of a single job's "Month YYYY - Month YYYY|Current" period,
 * as a decimal year count (e.g. 2.17 for 2 years 2 months).
 */
export function calculateJobDurationYears(period: string): number {
    const [start, end] = period.split(" - ");
    const startDate = parseExperienceDate(start);
    const endDate = parseExperienceDate(end);
    const {years, months} = calculateExperience(startDate, endDate);
    return years + months / 12;
}

/**
 * Format a whole years/months duration as "2Y 6M" (or just "2Y" / "6M" when
 * the other component is zero) — avoids the ambiguity of a decimal year
 * count, where e.g. "2.6" reads as "2 years 6 months" to a human but is
 * actually 2 years 7.2 months.
 */
function formatYearsMonths(years: number, months: number): string {
    if (years === 0) return `${months}M`;
    if (months === 0) return `${years}Y`;
    return `${years}Y ${months}M`;
}

/**
 * Format a job period's duration for display.
 *
 * The "Current" role is still elapsed time-to-date, shown as "2Y 2M+" — the
 * trailing "+" marks it as ongoing.
 *
 * Completed roles instead count both boundary months as fully worked (e.g.
 * "October 2018 - August 2019" is 11 months of employment, not the 10-month
 * calendar gap between the two dates) and never carry a "+" — the role has a
 * definite end.
 */
export function formatJobDurationYears(period: string): string {
    const [start, end] = period.split(" - ");
    const isCurrent = end.trim().toLowerCase() === "current";
    const startDate = parseExperienceDate(start);
    const endDate = parseExperienceDate(end);
    const {years, months} = calculateExperience(startDate, endDate);

    if (isCurrent) {
        return `${formatYearsMonths(years, months)}+`;
    }

    const totalMonths = years * 12 + months + 1;
    return formatYearsMonths(Math.floor(totalMonths / 12), totalMonths % 12);
}
