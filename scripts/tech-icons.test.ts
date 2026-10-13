import assert from "node:assert/strict";
import test from "node:test";
import { techIcon, techIconAsset } from "../src/components/tech-icons";

const displayedSkills = [
  "JavaScript", "TypeScript", "PHP", "Python", "Java",
  "Node.js", "Laravel", "Express", "Spring Boot", "REST APIs",
  "React", "Next.js", "Tailwind CSS", "Redux Toolkit",
  "PostgreSQL", "MySQL", "MariaDB", "SQLite", "Redis",
  "Prisma", "Drizzle ORM", "Eloquent",
  "AWS S3", "AWS SES", "Cloudinary", "AWS EC2", "Oracle Cloud Infrastructure",
  "Docker", "Docker Compose", "Docker Hub", "SonarQube", "Nginx", "PM2", "Linux",
  "Multi-tenancy", "JWT Authentication", "RBAC/PBAC", "Approval Workflows", "Encrypted Backups",
  "Vitest", "PHPUnit", "JUnit",
];

test("every displayed skill has an icon", () => {
  const missing = displayedSkills.filter(skill => !techIcon(skill) && !techIconAsset(skill));
  assert.deepEqual(missing, []);
  assert.equal(techIconAsset("SonarQube"), "/images/skills/sonarqube.svg");
});

test("configured social platforms resolve through the shared icon registry", () => {
  for (const platform of ["GitHub", "LinkedIn", "X"]) assert.ok(techIcon(platform), `${platform} icon is missing`);
});
