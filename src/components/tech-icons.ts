import type { IconType } from "react-icons";
import { FaAws, FaCloud, FaCode, FaCss3Alt, FaEnvelope, FaJava, FaLock, FaProjectDiagram, FaServer, FaShieldAlt, FaUsers } from "react-icons/fa";
import { FaDiscord, FaFacebookF, FaInstagram, FaLinkedinIn, FaStackOverflow, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { SiAngular, SiApachekafka, SiAxios, SiBootstrap, SiCloudinary, SiCypress, SiDjango, SiDocker, SiDrizzle, SiExpress, SiFastapi, SiFfmpeg, SiFigma, SiFirebase, SiFlask, SiGit, SiGithub, SiGithubactions, SiGo, SiGraphql, SiHtml5, SiInertia, SiJavascript, SiJest, SiJquery, SiJunit5, SiJsonwebtokens, SiKubernetes, SiLaravel, SiLivewire, SiLinux, SiMariadb, SiMongodb, SiMysql, SiNestjs, SiNextdotjs, SiNginx, SiNodedotjs, SiNpm, SiPhp, SiPm2, SiPostgresql, SiPostman, SiPrisma, SiPython, SiRabbitmq, SiReact, SiRedis, SiRedux, SiRust, SiSass, SiSocketdotio, SiSonarqubeserver, SiSpringboot, SiSqlite, SiStripe, SiSupabase, SiSvelte, SiSwagger, SiTailwindcss, SiThreedotjs, SiTypescript, SiVercel, SiVite, SiVitest, SiVuedotjs, SiWordpress } from "react-icons/si";
// Keys are tag names lowercased with everything except letters and digits removed.
const icons: Record<string, IconType> = {
  nextjs: SiNextdotjs, next: SiNextdotjs, react: SiReact, reactjs: SiReact, typescript: SiTypescript, ts: SiTypescript, javascript: SiJavascript, js: SiJavascript,
  nodejs: SiNodedotjs, node: SiNodedotjs, prisma: SiPrisma, mysql: SiMysql, docker: SiDocker, dockercompose: SiDocker, dockerhub: SiDocker, laravel: SiLaravel, eloquent: SiLaravel, livewire: SiLivewire, inertia: SiInertia, php: SiPhp, python: SiPython,
  ffmpeg: SiFfmpeg, aws: FaAws, awss3: FaAws, s3: FaAws, awsses: FaEnvelope, ses: FaEnvelope, awsec2: FaServer, ec2: FaServer, oraclecloudinfrastructure: FaCloud, oraclecloud: FaCloud, oracleoci: FaCloud, oci: FaCloud, git: SiGit, github: SiGithub, githubactions: SiGithubactions, cicd: SiGithubactions, tailwind: SiTailwindcss, tailwindcss: SiTailwindcss,
  postgresql: SiPostgresql, postgres: SiPostgresql, mongodb: SiMongodb, redis: SiRedis, html: SiHtml5, html5: SiHtml5, css: FaCss3Alt, css3: FaCss3Alt, vue: SiVuedotjs, vuejs: SiVuedotjs,
  nginx: SiNginx, linux: SiLinux, drizzle: SiDrizzle, drizzleorm: SiDrizzle, express: SiExpress, nestjs: SiNestjs, springboot: SiSpringboot, graphql: SiGraphql, firebase: SiFirebase, vercel: SiVercel, cloudinary: SiCloudinary,
  postman: SiPostman, figma: SiFigma, bootstrap: SiBootstrap, jquery: SiJquery, wordpress: SiWordpress, java: FaJava, go: SiGo, golang: SiGo, rust: SiRust, sass: SiSass, scss: SiSass,
  vite: SiVite, npm: SiNpm, jest: SiJest, vitest: SiVitest, phpunit: SiPhp, junit: SiJunit5, junit5: SiJunit5, cypress: SiCypress, kubernetes: SiKubernetes, supabase: SiSupabase, angular: SiAngular, svelte: SiSvelte, django: SiDjango,
  fastapi: SiFastapi, flask: SiFlask, sqlite: SiSqlite, mariadb: SiMariadb, kafka: SiApachekafka, rabbitmq: SiRabbitmq, stripe: SiStripe, swagger: SiSwagger, openapi: SiSwagger,
  threejs: SiThreedotjs, socketio: SiSocketdotio, redux: SiRedux, reduxtoolkit: SiRedux, axios: SiAxios, restapi: FaCode, rest: FaCode, api: FaCode, restfulapi: FaCode, restapis: FaCode,
  sonarqube: SiSonarqubeserver, sonarqubeserver: SiSonarqubeserver, pm2: SiPm2,
  linkedin: FaLinkedinIn, x: FaXTwitter, twitter: FaXTwitter, facebook: FaFacebookF, instagram: FaInstagram,
  youtube: FaYoutube, discord: FaDiscord, stackoverflow: FaStackOverflow,
  multitenancy: FaUsers, jwt: SiJsonwebtokens, jwtauthentication: SiJsonwebtokens, rbac: FaShieldAlt, pbac: FaShieldAlt, rbacpbac: FaShieldAlt,
  approvalworkflow: FaProjectDiagram, approvalworkflows: FaProjectDiagram, encryptedbackup: FaLock, encryptedbackups: FaLock,
};
export function techIcon(tag: string): IconType | undefined { return icons[tag.toLowerCase().replace(/[^a-z0-9]/g, "")]; }

const iconAssets: Record<string, string> = {
  sonarqube: "/images/skills/sonarqube.svg",
};

export function techIconAsset(tag: string): string | undefined { return iconAssets[tag.toLowerCase().replace(/[^a-z0-9]/g, "")]; }

// Official brand colors, keyed like `icons`. Tags without an entry keep the default accent color.
const brandColors: Record<string, string> = {
  nextjs: "var(--icon-dark)", next: "var(--icon-dark)", react: "#61DAFB", reactjs: "#61DAFB", typescript: "#3178C6", ts: "#3178C6", javascript: "#F7DF1E", js: "#F7DF1E",
  nodejs: "#5FA04E", node: "#5FA04E", prisma: "var(--icon-dark)", mysql: "#4479A1", docker: "#2496ED", dockercompose: "#2496ED", dockerhub: "#2496ED", laravel: "#FF2D20", eloquent: "#FF2D20", livewire: "#FB70A9", inertia: "#9553E9", php: "#777BB4", python: "#3776AB",
  ffmpeg: "#007808", aws: "#FF9900", awss3: "#569A31", s3: "#569A31", awsses: "#DD344C", ses: "#DD344C", awsec2: "#FF9900", ec2: "#FF9900", oraclecloudinfrastructure: "#F80000", oraclecloud: "#F80000", oracleoci: "#F80000", oci: "#F80000",
  git: "#F05032", github: "var(--icon-dark)", githubactions: "#2088FF", cicd: "#2088FF", tailwind: "#06B6D4", tailwindcss: "#06B6D4",
  postgresql: "#4169E1", postgres: "#4169E1", mongodb: "#47A248", redis: "#DC382D", html: "#E34F26", html5: "#E34F26", css: "#1572B6", css3: "#1572B6", vue: "#4FC08D", vuejs: "#4FC08D",
  nginx: "#009639", linux: "#FCC624", drizzle: "#C5F74F", drizzleorm: "#C5F74F", express: "var(--icon-dark)", nestjs: "#E0234E", springboot: "#6DB33F", graphql: "#E10098", firebase: "#FFCA28", vercel: "var(--icon-dark)", cloudinary: "#3448C5",
  postman: "#FF6C37", figma: "#F24E1E", bootstrap: "#7952B3", jquery: "#0769AD", wordpress: "#21759B", java: "#ED8B00", go: "#00ADD8", golang: "#00ADD8", rust: "#CE422B", sass: "#CC6699", scss: "#CC6699",
  vite: "#646CFF", npm: "#CB3837", jest: "#C21325", vitest: "#6E9F18", phpunit: "#777BB4", junit: "#25A162", junit5: "#25A162", cypress: "var(--icon-dark)", kubernetes: "#326CE5", supabase: "#3FCF8E", angular: "#DD0031", svelte: "#FF3E00", django: "var(--icon-dark)",
  fastapi: "#009688", flask: "var(--icon-dark)", sqlite: "var(--icon-dark)", mariadb: "var(--icon-dark)", kafka: "var(--icon-dark)", rabbitmq: "#FF6600", stripe: "#635BFF", swagger: "#85EA2D", openapi: "#6BA539",
  threejs: "var(--icon-dark)", socketio: "var(--icon-dark)", redux: "#764ABC", reduxtoolkit: "#764ABC", axios: "#5A29E4", restapi: "#009688", rest: "#009688", api: "#009688", restfulapi: "#009688", restapis: "#009688",
  sonarqube: "#4E9BCD", sonarqubeserver: "#4E9BCD", pm2: "var(--icon-dark)",
  linkedin: "#0A66C2", x: "var(--icon-dark)", twitter: "var(--icon-dark)", facebook: "#0866FF", instagram: "#E4405F", youtube: "#FF0000", discord: "#5865F2", stackoverflow: "#F58025",
  multitenancy: "#0EA5E9", jwt: "#D63AFF", jwtauthentication: "#D63AFF", rbac: "#16A34A", pbac: "#16A34A", rbacpbac: "#16A34A",
  approvalworkflow: "#F59E0B", approvalworkflows: "#F59E0B", encryptedbackup: "#64748B", encryptedbackups: "#64748B",
};
export function techIconColor(tag: string): string | undefined { return brandColors[tag.toLowerCase().replace(/[^a-z0-9]/g, "")]; }
