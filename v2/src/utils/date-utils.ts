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

  return { years, months };
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

  return { years, months, formatted };
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
