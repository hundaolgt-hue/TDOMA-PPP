import { todo, type Sourced } from "./types";

export type DeliveredProject = {
  name: string;
  year: Sourced<number>;
  valueM: Sourced<number>;
  description: string;
};

// GREYBOX PLACEHOLDERS — replace from company profile in /docs-source.
export const companyStats = {
  yearsActive: todo(25),
  projectsDelivered: todo(40),
  totalDeliveredValueM: todo(850),
} satisfies Record<string, Sourced<number>>;

export const deliveredProjects: DeliveredProject[] = [
  { name: "Project placeholder A", year: todo(2019), valueM: todo(120), description: "Mixed-use development — details from company profile." },
  { name: "Project placeholder B", year: todo(2021), valueM: todo(85), description: "Retail destination — details from company profile." },
  { name: "Project placeholder C", year: todo(2023), valueM: todo(210), description: "Commercial complex — details from company profile." },
];
