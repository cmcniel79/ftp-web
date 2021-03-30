import React, { Component } from 'react';
import css from './NativeLand.module.css';
import { FormattedMessage } from '../../util/reactIntl';
import { NativeLandSearchForm } from '../../forms';
import { userLocation } from '../../util/maps';
import { Modal } from '../../components';

class NativeLand extends Component {
  constructor(props) {
    super(props);
    this.selectOption = this.selectOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.useCurrentLocation = this.useCurrentLocation.bind(this);
    this.state = {
      tribeSearchInProgress: false,
      isModalOpen: false,
      tribes: this.props.tribes ? this.props.tribes : [],
    };
  }

  selectOption(option, e) {
    const slug = option && option.properties ? option.properties.Slug : null;
    const geometry = option && option.geometry ? option.geometry : null;

    const queryParamName = 'pub_nativeLands';
    this.props.onSelect({ [queryParamName]: slug });

    // Function for Search page
    if (this.props.saveTribes) {
      this.props.saveTribes(this.state.tribes);
    }

    // Function for Map page
    if (this.props.selectGeometry) {
      this.props.selectGeometry(geometry);
    }

    // blur event target if event is passed
    if (e && e.currentTarget) {
      e.currentTarget.blur();
    }
  }

  handleSubmit(values) {
    const { lat, lng } = values.location.selectedPlace.origin;
    this.getTribes(lat, lng);
    this.setState({ isModalOpen: false });
    this.setState({ tribeSearchInProgress: true });
  }

  getTribes(lat, lng) {
    if (this.props.setGeolocation) {
      this.props.setGeolocation(lat, lng);
    }
    const baseUrl = 'https://native-land.ca/api/index.php?maps=territories&position=';
    // Correct URL will look like 'https://native-land.ca/api/index.php?maps=territories&position=42.553080,-86.473389'
    // console.log(lat + " + " + lng);
    const apiURL = baseUrl + lat + "," + lng;

    fetch(apiURL)
      .catch(error => {
        this.setState({ tribeSearchInProgress: false });
        // console.log(error);
      })
      .then(response =>
        response.ok
          ? response.json()
          : Promise.reject(`Can't communicate with REST API server (${response.statusText})`),
      )
      .then(tribes => {
        this.setState({ tribes: tribes }) // Notify your component that products have been fetched
        this.setState({ tribeSearchInProgress: false })
      })
  }

  useCurrentLocation() {
    this.setState({ tribeSearchInProgress: true });
    userLocation()
      .then(location =>
        this.getTribes(location.lat, location.lng)
      )
      .catch(error => {
        this.setState({ tribeSearchInProgress: false });
        // console.log(error);
      })
  }

  render() {
    const { initialValues } = this.props;
    const queryParamName = 'pub_nativeLands';
    const initialValue = initialValues([queryParamName]);
    const modal =
      <Modal
        id="NativeLandLocationSearch"
        containerClassName={css.modalContainer}
        isOpen={this.state.isModalOpen}
        onClose={() => this.setState({ isModalOpen: false })}
        usePortal
        onManageDisableScrolling={() => null}
      >
        <h2 className={css.modalHeading}>
          <FormattedMessage id={'NativeLand.modalHeading'} />
        </h2>
        <NativeLandSearchForm
          onSubmit={this.handleSubmit}
        />
      </Modal>;

    const tribes =
      !this.state.tribeSearchInProgress && this.state.tribes.length > 0 ?
        <div>
          {this.state.tribes.map(t => {
            return (
              <button className=
                {t.properties.Slug === initialValue[queryParamName] ?
                  css.buttonSelected : css.button
                }
                key={t.properties.Name}
                onClick={() => this.selectOption(t)}>
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
          {!this.props.onMapPage ?
            <h5 className={css.tribeInfo}>
              <FormattedMessage id={'NativeLand.tribeInfo'} />
            </h5> :
            <h5 className={css.tribeInfo}>
              <FormattedMessage id={'NativeLand.tribeInfoMapPage'} />
            </h5>}
        </div> : null;

    const locationButtons =
      !this.state.tribeSearchInProgress && this.state.tribes.length === 0 ?
        <div>
          <button className={css.menuLabel} onClick={this.useCurrentLocation}>
            <FormattedMessage id={'NativeLand.currentLocation'} />
          </button>
          <button className={css.menuLabel} onClick={() => this.setState({ isModalOpen: true })}>
            <FormattedMessage id={'NativeLand.enterLocation'} />
          </button>
          {!this.props.onMapPage ?
            <h5>
              <FormattedMessage id={'NativeLand.nativeLandInfo'} />
            </h5>
            : null}
        </div>
        : null;

    const loadingTribes =
      this.state.tribeSearchInProgress ?
        <div>
          <h5>
            <FormattedMessage id={'NativeLand.nativeLandInProgress'} />
          </h5>
        </div>
        : null;

    return (
      <div className={css.nativeLandInfo}>
        <div>
          {!this.props.onMapPage &&
            <div className={css.half}></div>
          }
          {this.state.tribes.length === 0 ? (
            <h2 className={css.nativeLandHeader}>
              <FormattedMessage id={'NativeLand.defaultHeading'} />
            </h2>
          ) : (
            <h2 className={css.nativeLandHeader}>
              <FormattedMessage id={'NativeLand.nativeLandHeading'} />
            </h2>
          )}
        </div>
        {modal}
        {tribes}
        {loadingTribes}
        {locationButtons}
      </div>
    );
  }
}

export default NativeLand;