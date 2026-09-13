import styled from 'styled-components';

// Shared card-grid styling used by the Publications and Writing sections.

export const StyledCardSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* These headings are unnumbered by design, but must still advance the section
     counter so Contact's number matches its position in the nav. */
  counter-increment: section 1;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(700px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .scholar-note {
    margin: 10px 0 0;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    text-align: center;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

export const StyledCard = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    margin-bottom: 35px;

    .folder {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .project-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
    width: 100%;
  }

  /* Publications put the citation block alongside the copy; the blog cards have
     no metrics column and stay single-column. */
  .project-body.has-metrics {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }

  @media (max-width: 900px) {
    .project-body.has-metrics {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
    }
  }

  .project-metrics {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .citation-count {
    display: inline-block;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .project-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;
