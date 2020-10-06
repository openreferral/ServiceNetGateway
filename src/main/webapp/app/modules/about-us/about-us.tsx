import './about-us.scss';

import React from 'react';

export const AboutUs = props => (
  <div className="about-us p-4 p-md-5 text-justify">
    <h3>Service Net</h3>
    <div className="section">
      <p>
        Benetech Service Net is an innovative initiative that will make the social safety net more visible and efficient. A collaborative
        data management platform, Service Net enables the collective maintenance and sharing of real-time social services directory data.
        This solution will allow all stakeholders who help people access services – traditional referral providers like 2-1-1, local and
        state government agencies, web-based service locaters, and service providers – to share information about services available in
        their community. Service Net streamlines the accessibility, interoperability, and sustainability of data on local services, making
        it easier for people to get connected to the services they need to live and prosper.
      </p>
      <p>
        To learn more about Benetech Service Net, visit&nbsp;
        <a className="link" href="https://benetech.org/about/resources/benetech-service-net/">
          {'https://benetech.org/about/resources/benetech-service-net/'}
        </a>
      </p>
    </div>
    <h3 className="section-title">San Francisco Bay Area Pilot</h3>
    <div className="section">
      <p>
        Six Bay Area partners are currently using Benetech’s Service Net data collaboration platform to share and collaborate on their
        resource directory data, as part of a 6-month pilot:
        <ul>
          <li className="ml-5">Eden I&R (Alameda County 211)</li>
          <li className="ml-5">Health Leads</li>
          <li className="ml-5">Legal Aid Association of California</li>
          <li className="ml-5">San Mateo County (Human Services Agency)</li>
          <li className="ml-5">ShelterTech</li>
          <li className="ml-5">United Way Bay Area (Bay Area 211)</li>
        </ul>
      </p>
      <p>
        Learn more about the{' '}
        <a className="link" href="https://benetech.org/service-net-begins-pilot/">
          Bay Area pilot launch.
        </a>
      </p>
    </div>
    <h3 className="section-title">
      Benetech (
      <a className="link" href="https://benetech.org">
        benetech.org
      </a>
      )
    </h3>
    <div className="section">
      <p>
        Benetech is a nonprofit that empowers communities with software for social good. Benetech’s work transforms how people with
        disabilities read and learn, enables human rights defenders and civilians to pursue truth and justice, and connects people to the
        services they need to live and prosper. We serve as a bridge betweenthe social sector and Silicon Valley by working closely with
        both communities to identify needs and software solutions that can drive positive social change. Benetech is constantly pursuing the
        next big social impact.
      </p>
    </div>
    <h3 className="section-title">Contact</h3>
    <div className="section">
      <p>
        If you have any questions or want to learn more about Service Net and our pilot, contact us at{' '}
        <a className="link" href="mailto:servicenet@benetech.org">
          servicenet@benetech.org.
        </a>
      </p>
    </div>
  </div>
);
