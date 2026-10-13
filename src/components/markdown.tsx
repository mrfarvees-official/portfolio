import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import GithubSlugger from "github-slugger";
function textOf(children: ReactNode): string {
  return Children.toArray(children).map(c => isValidElement<{ children?: ReactNode }>(c) ? textOf(c.props.children) : String(c)).join("");
}
export function Markdown({ body }: { body: string }) {
  const s = new GithubSlugger();
  return <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ h2: ({children}) => <h2 id={s.slug(textOf(children))}>{children}</h2>, h3: ({children}) => <h3 id={s.slug(textOf(children))}>{children}</h3>, img: ({src,alt}) => <img src={src} alt={alt ?? ""} loading="lazy"/> }}>{body}</ReactMarkdown></div>;
}
export function Contents({ body }: { body: string }) {
  const s = new GithubSlugger();
  return <aside className="contents"><h2>On this page</h2><ReactMarkdown remarkPlugins={[remarkGfm]} allowedElements={["h2", "h3", "strong", "em", "code", "del", "a"]} components={{ h2: ({children}) => <a href={`#${s.slug(textOf(children))}`}>{children}</a>, h3: ({children}) => <a className="contents-sub" href={`#${s.slug(textOf(children))}`}>{children}</a>, a: ({children}) => <span>{children}</span> }}>{body}</ReactMarkdown></aside>;
}
