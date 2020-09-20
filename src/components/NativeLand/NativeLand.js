import React, { Component } from 'react';
import css from './NativeLand.css';
import { FormattedMessage } from '../../util/reactIntl';
import { NativeLandSearchForm } from '../../forms';
import { userLocation } from '../../util/maps';
import { Modal } from '../../components';

const getQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames) ? queryParamNames[0] : queryParamNames;
};

class NativeLand extends Component {
  constructor(props) {
    super(props);
    this.selectOption = this.selectOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.useCurrentLocation = this.useCurrentLocation.bind(this);
    this.state = {
      isLocationEntered: false,
      isModalOpen: false,
      tribes: []
    };
  }

  selectOption(option, e) {
    const { queryParamNames } = this.props.filterConfig;
    const onSelect = this.props.getHandleChangedValueFn(true);
    const queryParamName = getQueryParamName(queryParamNames);
    console.log(queryParamName);
    onSelect({ [queryParamName]: option });

    // blur event target if event is passed
    if (e && e.currentTarget) {
      e.currentTarget.blur();
    }
  }

  handleSubmit(values) {
    const { lat, lng } = values.location.selectedPlace.origin;
    console.log(lat);
    console.log(lng);
    console.log('Submitted!');
    this.getTribes(lat, lng);
    this.setState({ isModalOpen: false });
  }

  getTribes(lat, lng) {
    const baseUrl = 'https://native-land.ca/api/index.php?maps=territories&position=';
    // Correct URL will look like 'https://native-land.ca/api/index.php?maps=territories&position=42.553080,-86.473389'
    // console.log(lat + " + " + lng);
    const apiURL = baseUrl + lat + "," + lng;
    // const apiURL = 'https://native-land.ca/api/index.php?maps=territories&position='; //for testing
    fetch(apiURL)
      .then(response =>
        response.ok
          ? response.json()
          : Promise.reject(`Can't communicate with REST API server (${response.statusText})`),
      )
      .then(tribes => {
        this.setState({ tribes }) // Notify your component that products have been fetched
      })
  }

  useCurrentLocation() {
    this.setState({ isLocationEntered: true });
    userLocation().then(location =>
      this.getTribes(location.lat, location.lng)
    )
  }

  render() {
    const { initialValues } = this.props;
    const { queryParamNames } = this.props.filterConfig;
    const queryParamName = getQueryParamName(queryParamNames);
    const initialValue = initialValues(queryParamNames);
    const modal =
      <Modal
        id="NativeLandLocationSearch"
        containerClassName={css.modalContainer}
        isOpen={this.state.isModalOpen}
        onClose={() => this.setState({ isModalOpen: false })}
        usePortal
        onManageDisableScrolling={() => null}
      >
        <h2>
          Native Land Search
        </h2>
        <NativeLandSearchForm
          onSubmit={this.handleSubmit}
        />
      </Modal>;

    const tribes =
      this.state.tribes.length > 0 ?
        <div>
          {this.state.tribes.map(t => {
            return (
              <button className=
                {t.properties.Slug === initialValue[queryParamName] ?
                  css.buttonSelected : css.button
                }
                key={t.properties.Name}
                onClick={() => this.selectOption(t.properties.Slug)}>
                <h4 className={css.buttonText}> {t.properties.Name} </h4>
              </button>
            )
          })}
          <button className={css.clearButton} onClick={e => this.selectOption(null, e)}>
            <FormattedMessage id={'NativeLand.plainClear'} />
          </button>
          <button className={css.greySearchButton} onClick={() => this.setState({ isModalOpen: true })}>
            <FormattedMessage id={'NativeLand.enterLocation'} />
          </button>
          <h5 className={css.tribeInfo}>
            <FormattedMessage id={'NativeLand.tribeInfo'} />
          </h5>
        </div> : null;

    const locationButtons =
      this.state.tribes.length === 0 ?
        <div>
          <button className={css.menuLabel} onClick={this.useCurrentLocation}>
            <FormattedMessage id={'NativeLand.currentLocation'} />
          </button>
          <button className={css.menuLabel} onClick={() => this.setState({ isModalOpen: true })}>
            <FormattedMessage id={'NativeLand.enterLocation'} />
          </button>
          <h5>
            <FormattedMessage id={'NativeLand.nativeLandInfo'} />
          </h5>
        </div>
        : null;

    return (
      <div className={css.nativeLandInfo}>
        <div className={css.half}></div>
        { this.state.tribes.length === 0 ?
          <h2 className={css.nativeLandHeader}>
            <FormattedMessage id={'NativeLand.defaultHeading'} />
          </h2>
          :
          <h2 className={css.nativeLandHeader}>
            <FormattedMessage id={'NativeLand.nativeLandHeading'} />
          </h2>
        }
        {modal}
        {tribes}
        {locationButtons}
      </div>
    );
  }
}

export default NativeLand;