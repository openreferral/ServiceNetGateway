import React from 'react';
import '../provider-site.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { translate } from 'react-jhipster';

export default function SearchBar() {
  return (
    <div className="search-bar">
      <form className="search-from">
        <div className="search-input-container">
          <input className="search-input" type="text" placeholder={translate('providerSite.searchPlaceholder')} />
        </div>
        <div className="search-button">
          <span className="search-button search-icon">
            <FontAwesomeIcon className="self-align-center" size="xs" icon="search" />
          </span>
        </div>
      </form>
    </div>
  );
}
