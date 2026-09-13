import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { StyledCardSection, StyledCard } from './cardGrid';

const GRID_LIMIT = 6;

const Writing = () => {
  const data = useStaticQuery(graphql`
    query {
      posts: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/blog/" }
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
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealItems = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealItems.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const posts = data.posts.edges.filter(({ node }) => node);
  const itemsToShow = showMore ? posts : posts.slice(0, GRID_LIMIT);

  const postInner = node => {
    const { frontmatter, html } = node;
    const { github, external, title, tech } = frontmatter;

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

        <div className="project-body">
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
        </div>
      </div>
    );
  };

  return (
    <StyledCardSection id="blog">
      <h2 ref={revealTitle}>Writing</h2>

      <ul className="projects-grid">
        {prefersReducedMotion ? (
          <>
            {itemsToShow &&
              itemsToShow.map(({ node }, i) => <StyledCard key={i}>{postInner(node)}</StyledCard>)}
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
                    {postInner(node)}
                  </StyledCard>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>

      {posts.length > GRID_LIMIT && (
        <button className="more-button" onClick={() => setShowMore(!showMore)}>
          Show {showMore ? 'Less' : 'More'}
        </button>
      )}
    </StyledCardSection>
  );
};

export default Writing;
