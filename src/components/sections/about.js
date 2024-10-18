import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

// Import SVG as Components
import DockerIcon from '../../images/skills/docker';
import AnsibleIcon from '../../images/skills/ansible';
import JenkinsIcon from '../../images/skills/jenkins';
import KubernetesIcon from '../../images/skills/kubernetes';
import GitIcon from '../../images/skills/git';
import PrometheusIcon from '../../images/skills/prometheus';
import SysdigIcon from '../../images/skills/sysdig';
import GrafanaIcon from '../../images/skills/grafana';
import PythonIcon from '../../images/skills/python';
import BashIcon from '../../images/skills/bash';
import TensorFlowIcon from '../../images/skills/tensorflow';
import PytorchIcon from '../../images/skills/pytorch';
import RedhatIcon from '../../images/skills/redhat';
import F5Icon from '../../images/skills/f5';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 4fr 3fr;
    grid-gap: 70px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const StyledText = styled.div`
  .skills-category {
    margin-top: 40px;
  }

  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(6, minmax(40px, 40px));
    grid-gap: 20px;
    padding: 0;
    margin: 10px 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      gap: 10px;

      svg {
        width: 40px;
        height: 40px;
      }
    }
  }
  p {
    margin-bottom: 40px;
  }
`;

const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {return;}
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skillCategories = {
    'DevOps Tools': [
      <DockerIcon key="docker" />,
      <AnsibleIcon key="ansible" />,
      <JenkinsIcon key="jenkins" />,
      <KubernetesIcon key="kubernetes" />,
      <GitIcon key="git" />,
      <RedhatIcon key="redhat" />,
    ],
    'Monitoring & Observability': [
      <PrometheusIcon key="prometheus" />,
      <SysdigIcon key="sysdig" />,
      <GrafanaIcon key="grafana" />,
      <F5Icon key="f5" />,
    ],
    'Programming Language': [<PythonIcon key="python" />, <BashIcon key="bash" />],
    'ML Framework': [<TensorFlowIcon key="tensorflow" />, <PytorchIcon key="pytorch" />],
  };

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>Hello! I'm Saadman Sakif Arnob, from Dhaka, Bangladesh.</p>
            <p>
              A DevOps enthusiast, passionate about driving automation, scalability, and efficiency.
              I focus on combining infrastructure optimization, CI/CD pipeline automation, and cloud
              technologies to ensure smooth, reliable service delivery.
            </p>

            <p>
              I completed my Bachelor's in{' '}
              <a href="https://eee.iutoic-dhaka.edu/">Electrical Engineering</a> from{' '}
              <a href="https://www.iutoic-dhaka.edu/">IUT, Dhaka</a>. I am working as a System
              Engineer at <a href="https://www.bkash.com/">bKash</a>, a leading FinTech Company in
              Bangladesh. My role involves optimizing infrastructure, automating deployments, and
              ensuring the seamless functioning of digital financial services relied on by millions
              daily.
            </p>
            <p>Here are a few technologies I’ve been working with recently:</p>
          </div>

          {Object.entries(skillCategories).map(([category, icons], index) => (
            <div className="skills-category" key={index}>
              <h4>{category}</h4>
              <ul className="skills-list">
                {icons.map(icon => (
                  <li key={icon.key}>{icon}</li>
                ))}
              </ul>
            </div>
          ))}
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.jpg"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
