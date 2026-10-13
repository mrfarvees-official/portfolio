// Original case-study copy based on the public PeopleOps source, not the example site's prose.
// https://github.com/mrfarvees-official/peopleops/blob/main/features/landing/landing-page.tsx
// https://github.com/mrfarvees-official/peopleops/blob/main/platform/application/hr-modules.ts
// https://github.com/mrfarvees-official/peopleops/blob/main/platform/application/pbac.ts
// https://github.com/mrfarvees-official/peopleops/blob/main/platform/application/backup.ts
// https://github.com/mrfarvees-official/peopleops/blob/main/docs/DEPLOYMENT.md
export const peopleOpsIntro = "PeopleOps is my first project: a multi-company HR platform for employee records, leave, attendance, payroll and recruitment. Policy-based permissions and audit logging run alongside the everyday workflows.";
export const peopleOpsSummary = "A multi-company HR platform with employee records, leave, attendance, payroll and recruitment, backed by policy-based permissions and audit logging.";
export const peopleOpsSections = [
  {
    title: "The problem",
    body: "HR software needs to coordinate employee records and approval workflows without exposing the same information to everyone. An employee, a manager and a payroll administrator need different views and different rights.\n\nPeopleOps brings these workflows into one application. Company context and authorization are part of the operations themselves, rather than only a set of menus in the interface.",
  },
  {
    title: "What it does",
    body: "- **Employees and organization:** employee profiles, organizational units and reporting relationships, with sensitive-field handling.\n- **Leave and attendance:** leave requests and decisions, plus attendance records.\n- **Payroll:** payroll runs, payslips and a publication workflow.\n- **Recruitment:** candidate records and hiring stages.\n- **Access policies:** actions are checked against policies using the account, roles and company context.\n- **Audit and data tools:** audit records, CSV/JSON transfer and backup workflows.\n\nThe demo lets visitors explore sample HR data through different account roles and see how permissions change the interface.\n\n[Explore the repository](https://github.com/mrfarvees-official/peopleops).",
  },
  {
    title: "Decisions that shaped it",
    body: "### Keep authorization beside the operation\n\nThe authorizer loads applicable policies using the user's company, account and roles. It evaluates the requested action against the resource. An asserted denial is recorded in the audit log and throws a forbidden error. This provides an application-level authorization boundary beyond hiding buttons.\n\n### Separate workflows from persistence\n\nThe code separates feature interfaces, application services, domain definitions and infrastructure repositories. HR module definitions describe fields, filters and transitions; infrastructure adapters handle persistence.\n\n### Use a relational application stack\n\nPeopleOps uses Next.js, React and TypeScript, with Prisma and its MariaDB adapter for the MySQL database. The repository defines type-checking, Vitest and dependency-boundary checks alongside the application.",
  },
  {
    title: "Workflow rules",
    body: "Leave requests have explicit transitions such as submission, approval, rejection and cancellation. Submission checks the leave allowance; rejection requires a decision note. HR preparation logic also checks date ordering and company-owned references.\n\nEmployee relationships are validated before saving: an employee cannot manage themselves, and an organizational unit cannot be placed under itself. These rules keep invalid relationships out of the workflow rather than only warning in the form.",
  },
  {
    title: "Backups and recovery",
    body: "Backups are compressed bundles of supported tables, with a checksum stored beside the backup record. Loading a backup verifies the checksum and format before processing its contents.\n\nRestore supports a dry run. Applying a restore first creates a safety backup, then performs table writes in a transaction. Authorization is checked for the scope and the table operations. This keeps recovery connected to both data integrity and access control.",
  },
  {
    title: "Deployment",
    body: "The repository provides Docker Compose services for MySQL, a migration/seed job, the Next.js application and Caddy. The application waits for migration completion, and Caddy provides the public HTTPS entry point.\n\nThe bundled database port is bound to localhost. Named volumes hold database and backup state. The default public hostname in this configuration is `peopleops.farvees.xyz`.\n\n[Deployment documentation](https://github.com/mrfarvees-official/peopleops/blob/main/docs/DEPLOYMENT.md).",
  },
  {
    title: "Result",
    body: "PeopleOps combines employee and organization records, approval flows, access policies and recovery tools in one codebase. The demo provides a way to explore these workflows through different account roles.\n\nFor my first project, it brings together the interface, business rules, persistence and deployment setup needed for an HR application. The implementation is available in the public repository.",
  },
  {
    title: "What I'd do next",
    body: "The next improvements I'd focus on are:\n\n- Add screenshots of the actual employee, leave and policy views to this case study.\n- Create a walkthrough showing how the same workflow appears to an employee, manager and HR administrator.\n- Record reproducible deployment and performance checks to document operational behavior.",
  },
];
