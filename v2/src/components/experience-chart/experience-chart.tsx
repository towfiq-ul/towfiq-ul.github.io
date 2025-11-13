import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import styles from "./experience-chart.module.css";
import { workExperience } from "../../data/portfolio-data";
import { parseExperienceDate, calculateExperience } from "../../utils/date-utils";

// Calculate work type distribution from actual data
function calculateWorkTypeData() {
  const workTypeMap = new Map<string, number>();

  workExperience.forEach((exp) => {
    const type = exp.type.toLowerCase();
    const isFullTime = type.includes("full-time");
    const isPartTime = type.includes("part-time");

    // Calculate years using centralized utility
    const [start, end] = exp.period.split(" - ");
    const startDate = parseExperienceDate(start);
    const endDate = parseExperienceDate(end);
    const experience = calculateExperience(startDate, endDate);
    const years = experience.years + experience.months / 12;

    if (isFullTime) {
      workTypeMap.set("Full-time", (workTypeMap.get("Full-time") || 0) + years);
    } else if (isPartTime) {
      workTypeMap.set("Part-time", (workTypeMap.get("Part-time") || 0) + years);
    }
  });

  return [
    { name: "Full-time", value: Number((workTypeMap.get("Full-time") || 0).toFixed(1)), color: "var(--color-accent-9)" },
    { name: "Part-time", value: Number((workTypeMap.get("Part-time") || 0).toFixed(1)), color: "var(--color-accent-6)" },
  ].filter((item) => item.value > 0);
}

// Calculate location distribution from actual data
function calculateLocationData() {
  const locationMap = new Map<string, number>();

  workExperience.forEach((exp) => {
    const type = exp.type.toLowerCase();
    const isRemote = type.includes("remote");
    const isHybrid = type.includes("hybrid");
    const isPhysical = !isRemote && !isHybrid;

    // Calculate years using centralized utility
    const [start, end] = exp.period.split(" - ");
    const startDate = parseExperienceDate(start);
    const endDate = parseExperienceDate(end);
    const experience = calculateExperience(startDate, endDate);
    const years = experience.years + experience.months / 12;

    if (isRemote) {
      locationMap.set("Remote", (locationMap.get("Remote") || 0) + years);
    } else if (isHybrid) {
      locationMap.set("Hybrid", (locationMap.get("Hybrid") || 0) + years);
    } else if (isPhysical) {
      locationMap.set("Physical", (locationMap.get("Physical") || 0) + years);
    }
  });

  return [
    { name: "Remote", value: Number((locationMap.get("Remote") || 0).toFixed(1)), color: "var(--color-accent-9)" },
    { name: "Hybrid", value: Number((locationMap.get("Hybrid") || 0).toFixed(1)), color: "var(--color-accent-6)" },
    { name: "Physical", value: Number((locationMap.get("Physical") || 0).toFixed(1)), color: "var(--color-accent-4)" },
  ].filter((item) => item.value > 0);
}

export function ExperienceChart() {
  const workTypeData = calculateWorkTypeData();
  const locationData = calculateLocationData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{payload[0].name}</p>
          <p className={styles.tooltipValue}>{payload[0].value} years</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartGrid}>
        {/* Work Type Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Work Type Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={workTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}\n${(entry.percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
              >
                {workTypeData.map((entry, index) => (
                  <Cell key={`cell-type-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Location Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Location Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}\n${(entry.percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-location-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
