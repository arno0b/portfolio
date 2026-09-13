import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Citations per year for a single publication.
 *
 * One series, so no legend -- the heading names it. Every bar is direct-labelled
 * (there are only ever a handful of years), which doubles as the text alternative
 * for the SVG.
 */

const BAR_W = 34;
const BAR_GAP = 12;
const PLOT_H = 78;
const LABEL_H = 16; // value labels above the bars
const AXIS_H = 20; // year labels below the baseline
const RADIUS = 4;

const StyledChart = styled.figure`
  width: 100%;
  margin: 12px 0 0;
  padding: 0;

  figcaption {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    margin-bottom: 6px;
  }

  /* Sized intrinsically from the viewBox so a two-year chart renders at the same
     bar width and label size as a six-year one; it only scales down to fit. */
  svg {
    display: block;
    /* width and height must be explicit: GlobalStyle sets a blanket
       svg rule of width 100% / height 100%. CSS width:auto is no good here --
       for inline SVG it resolves to 100%, not the width attribute -- so the
       intrinsic size is applied as an inline max-width cap instead. */
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .bar {
    fill: var(--chart-bar);
  }

  .bar-empty {
    fill: var(--lightest-navy);
  }

  .value {
    fill: var(--light-slate);
    font-family: var(--font-mono);
    font-size: 12px;
    text-anchor: middle;
  }

  .year {
    fill: var(--slate);
    font-family: var(--font-mono);
    font-size: 11px;
    text-anchor: middle;
  }

  .baseline {
    stroke: var(--lightest-navy);
    stroke-width: 1;
  }
`;

/** Rounds only the data end; the baseline end stays square. */
const barPath = (x, y, w, h) => {
  const r = Math.min(RADIUS, h, w / 2);
  const bottom = y + h;
  return [
    `M${x},${bottom}`,
    `L${x},${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `L${x + w - r},${y}`,
    `Q${x + w},${y} ${x + w},${y + r}`,
    `L${x + w},${bottom}`,
    'Z',
  ].join(' ');
};

const CitationChart = ({ citationsByYear, title }) => {
  const years = Object.keys(citationsByYear).sort();

  if (!years.length) {
    return null;
  }

  const counts = years.map(y => citationsByYear[y]);
  const max = Math.max(...counts, 1);
  const width = years.length * BAR_W + (years.length - 1) * BAR_GAP;
  const height = LABEL_H + PLOT_H + AXIS_H;
  const baselineY = LABEL_H + PLOT_H;

  const summary = years.map(y => `${y}: ${citationsByYear[y]}`).join(', ');

  return (
    <StyledChart>
      <figcaption>Citations per year</figcaption>
      <svg
        width={width}
        height={height}
        style={{ maxWidth: width }}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMinYMid meet"
        role="img"
        aria-label={`Citations per year for ${title}. ${summary}.`}>
        <line className="baseline" x1="0" y1={baselineY} x2={width} y2={baselineY} />

        {years.map((year, i) => {
          const count = citationsByYear[year];
          const x = i * (BAR_W + BAR_GAP);
          // Zero years keep a faint stub so the axis label still has a mark under it.
          const h = count === 0 ? 2 : Math.max(3, Math.round((count / max) * PLOT_H));
          const y = baselineY - h;

          return (
            <g key={year}>
              <title>{`${year}: ${count} citation${count === 1 ? '' : 's'}`}</title>
              <path className={count === 0 ? 'bar-empty' : 'bar'} d={barPath(x, y, BAR_W, h)} />
              <text className="value" x={x + BAR_W / 2} y={y - 5}>
                {count}
              </text>
              <text className="year" x={x + BAR_W / 2} y={baselineY + 15}>
                {year}
              </text>
            </g>
          );
        })}
      </svg>
    </StyledChart>
  );
};

CitationChart.propTypes = {
  citationsByYear: PropTypes.object.isRequired,
  title: PropTypes.string,
};

export default CitationChart;
