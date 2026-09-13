import React, { useState, useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import CitationChart from '@components/citationChart';
import { StyledCardSection, StyledCard } from './cardGrid';
import scholarData from '../../data/scholar.json';

// Refreshed by `npm run update:scholar` -- see scripts/update-scholar.js.
const scholarById = new Map(scholarData.publications.map(p => [p.scholarId, p]));

const GRID_LIMIT = 6;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Formatted by hand off UTC getters -- toLocaleDateString would render differently
// in the Node build than in the browser and trip a hydration mismatch.
const fetchedAt = new Date(scholarData.fetchedAt);
const updatedOn = `${fetchedAt.getUTCDate()} ${
  MONTHS[fetchedAt.getUTCMonth()]
} ${fetchedAt.getUTCFullYear()}`;

const Publications = () => {
  const data = useStaticQuery(graphql`
    query {
      publications: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/publications/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              tech
              github
              external
              scholarId
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealItems = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealItems.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const publications = data.publications.edges.filter(({ node }) => node);
  const itemsToShow = showMore ? publications : publications.slice(0, GRID_LIMIT);

  const publicationInner = node => {
    const { frontmatter, html } = node;
    const { github, external, title, tech, scholarId } = frontmatter;
    const scholar = scholarId ? scholarById.get(scholarId) : null;

    return (
      <div className="project-inner">
        <div className="project-top">
          <div className="folder">
            <Icon name="Folder" />
          </div>
          <div className="project-links">
            {github && (
              <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                <Icon name="GitHub" />
              </a>
            )}
            {external && (
              <a
                href={external}
                aria-label="External Link"
                className="external"
                target="_blank"
                rel="noreferrer">
                <Icon name="External" />
              </a>
            )}
          </div>
        </div>

        <div className={`project-body${scholar ? ' has-metrics' : ''}`}>
          <div className="project-main">
            <h3 className="project-title">
              <a href={external} target="_blank" rel="noreferrer">
                {title}
              </a>
            </h3>

            <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />

            {tech && (
              <ul className="project-tech-list">
                {tech.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {scholar && (
            <aside className="project-metrics">
              <a
                className="citation-count"
                href={scholarData.profileUrl}
                target="_blank"
                rel="noreferrer">
                Cited by {scholar.citations}
              </a>
              <CitationChart citationsByYear={scholar.citationsByYear} title={title} />
            </aside>
          )}
        </div>
      </div>
    );
  };

  return (
    <StyledCardSection id="publications">
      <h2 ref={revealTitle}>Publications</h2>

      <Link className="inline-link archive-link" to="/archive" ref={revealArchiveLink}>
        view the full archive
      </Link>

      <p className="scholar-note">
        <a href={scholarData.profileUrl} target="_blank" rel="noreferrer">
          {scholarData.totals.citations} citations
        </a>{' '}
        &middot; h-index {scholarData.totals.hIndex} &middot; from Google Scholar, updated{' '}
        {updatedOn}
      </p>

      <ul className="projects-grid">
        {prefersReducedMotion ? (
          <>
            {itemsToShow &&
              itemsToShow.map(({ node }, i) => (
                <StyledCard key={i}>{publicationInner(node)}</StyledCard>
              ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {itemsToShow &&
              itemsToShow.map(({ node }, i) => (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledCard
                    ref={el => (revealItems.current[i] = el)}
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
                    {publicationInner(node)}
                  </StyledCard>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>

      {publications.length > GRID_LIMIT && (
        <button className="more-button" onClick={() => setShowMore(!showMore)}>
          Show {showMore ? 'Less' : 'More'}
        </button>
      )}
    </StyledCardSection>
  );
};

export default Publications;
