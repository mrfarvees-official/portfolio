import type { Settings } from "../../lib/settings";
import { ButtonLink } from "../../components/ui";
export function Hero({ hero }: { hero: Settings["hero"] }) {
  return (
    <section className="section hero">
      <div className="container hero-grid">
        <div>
          <h2>{hero.headline}</h2>
          <p>{hero.subtext}</p>
          <div className="actions">
            <ButtonLink href={hero.primary.href}>
              {hero.primary.label} →
            </ButtonLink>
            <ButtonLink href={hero.secondary.href} secondary>
              {hero.secondary.label}
            </ButtonLink>
          </div>
        </div>
        <figure className="portrait">
          <div className="portrait-image">
            {hero.photo ? (
              <img
                src={hero.photo}
                alt={hero.photoAlt || "Developer portrait"}
              />
            ) : (
              <span className="placeholder-label">[Your photo]</span>
            )}
          </div>
          <figcaption>aka {hero.handle}</figcaption>
        </figure>
      </div>
    </section>
  );
}
