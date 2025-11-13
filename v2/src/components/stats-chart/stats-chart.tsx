import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import styles from "./stats-chart.module.css";
import { calculateExperience } from "../../utils/date-utils";

// Calculate dynamic experience based on when technologies were first used
// Java/Spring: Started October 2018 (Presidency School)
// PHP/Laravel: Started September 2019 (Inflack Limited)  
// Cloud/AWS: Started December 2019 (Exabyting)
// Databases: Started October 2018 (with Java)
// DevOps: Started December 2019 (Exabyting)

function calculateTechExperience() {
  const now = new Date();

    const phpStart = new Date(2016, 4); // May 2016
    const dbStart = new Date(2018, 4); // May 2018
    const devopsStart = new Date(2019, 8); // September 2019
    const javaStart = new Date(2019, 11); // December 2019
    const cloudStart = new Date(2020, 3); // April 2020

  const javaExp = calculateExperience(javaStart, now);
  const phpExp = calculateExperience(phpStart, javaStart);
  const cloudExp = calculateExperience(cloudStart, now);
  const dbExp = calculateExperience(dbStart, now);
  const devopsExp = calculateExperience(devopsStart, now);
  
  return [
    { name: "Java/Spring", years: Number((javaExp.years + javaExp.months / 12).toFixed(1)), color: "var(--color-accent-9)" },
    { name: "PHP/Laravel", years: Number((phpExp.years + phpExp.months / 12).toFixed(1)), color: "var(--color-accent-7)" },
    { name: "Cloud/AWS", years: Number((cloudExp.years + cloudExp.months / 12).toFixed(1)), color: "var(--color-accent-8)" },
    { name: "Databases", years: Number((dbExp.years + dbExp.months / 12).toFixed(1)), color: "var(--color-accent-10)" },
    { name: "DevOps", years: Number((devopsExp.years + devopsExp.months / 12).toFixed(1)), color: "var(--color-accent-6)" },
  ];
}

export function StatsChart() {
  const data = calculateTechExperience();
  
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Experience by Technology (Years)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" stroke="var(--color-neutral-11)" style={{ fontSize: "12px" }} />
          <YAxis stroke="var(--color-neutral-11)" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              background: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
              backdropFilter: "blur(10px)",
              color: "white",
            }}
            itemStyle={{ color: "white" }}
            labelStyle={{ color: "white" }}
          />
          <Bar dataKey="years" radius={[8, 8, 0, 0]} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
