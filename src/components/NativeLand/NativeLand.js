import React, { Component } from 'react';
import { userLocation } from '../../util/maps';
import css from './NativeLand.css';

class NativeLand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tribes: [],
    };
  }

  //Code below taken and modified from https://stackoverflow.com/questions/47058386/react-map-function-in-component-doesnt-work
  componentDidMount() {
    var baseUrl = 'https://native-land.ca/api/index.php?maps=territories&position=';
    // Correct URL will look like 'https://native-land.ca/api/index.php?maps=territories&position=42.553080,-86.473389'
    userLocation().then(location => {
      console.log(location.lat + " + " + location.lng);
      const apiURL = baseUrl + location.lat + "," + location.lng;
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
    })
  }

  render() {
    const tribes = this.state.tribes;
    let landInfo;
    let landPhrase;
    if (tribes.length > 0) {
      landPhrase = <h3>You are on this tribe's land: </h3>
      if (tribes.length > 1) {
        landPhrase = <h3>You are on these tribe's land: </h3>
      } 
      landInfo =
        <div className={css.nativeLandHeader}>
          {landPhrase}
          {this.state.tribes.map(t => {
            return <h3 key={t.properties.Name}> {t.properties.Name} </h3>;
          })}
          <h5>Click on a tribe's name to search for vendors from that tribe</h5>
        </div>
    }

    return (
      <div>{landInfo}</div>
    );
  }
}

export default NativeLand;
