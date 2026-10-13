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
