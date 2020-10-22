import React, { Component } from 'react';
import { render } from 'react-dom';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import bed from '../../assets/bed.svg';
import dining from '../../assets/dining.svg';
import other from '../../assets/other.svg';
import people from '../../assets/people.svg';
import retail from '../../assets/shopping.svg';
import work from '../../assets/work.svg';
import fitness from '../../assets/fitness.svg';

import css from './MapPage.css';

export class MapLegend extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const options = this.props.options;
        return (
            <div className={css.legendBox}>
                <div className={css.half}></div>
                <h2 className={css.legendTitle}>
                    <FormattedMessage id="MapPage.legendTitle" />
                </h2>
                {/* <div className={css.firstColumn}> */}
                    <div className={css.legendBlock}>
                        <img className={css.image} src={retail} alt="icon" />
                        <span className={css.legendLabel}>Retail</span>
                    </div>
                    <div className={css.legendBlock}>
                        <img className={css.image} src={dining} alt="icon" />
                        <span className={css.legendLabel}>Dining</span>
                    </div>
                    <div className={css.legendBlock}>
                        <img className={css.image} src={work} alt="icon" />
                        <span className={css.legendLabel}>Professional Services</span>
                    </div>
                    <div className={css.legendBlock}>
                        <img className={css.image} src={bed} alt="icon" />
                        <span className={css.legendLabel}>Hospitality and Tourism</span>
                    </div>
                    <div className={css.legendBlock}>
                        <img className={css.image} src={people} alt="icon" />
                        <span className={css.legendLabel}>Non-Profits</span>
                    </div>
                    <div className={css.legendBlock}>
                        <img className={css.image} src={fitness} alt="icon" />
                        <span className={css.legendLabel}>Beauty and Personal Services</span>
                    </div>
                    <div className={css.legendBlock}>
                        <img className={css.image} src={other} alt="icon" />
                        <span className={css.legendLabel}>Other</span>
                    </div>
                </div>
            // </div>
        );
    }
}

export default MapLegend;
