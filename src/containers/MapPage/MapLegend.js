import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import bed from '../../assets/bed.svg';
import dining from '../../assets/dining.svg';
import other from '../../assets/location.svg';
import people from '../../assets/people.svg';
import retail from '../../assets/shopping.svg';
import work from '../../assets/work.svg';
import fitness from '../../assets/fitness.svg';
import art from '../../assets/art.svg';
import verified from '../../assets/checkmark-circle-outline.svg';

import css from './MapPage.css';

export class MapLegend extends Component {

    render() {
        return (
            <div className={css.legendBox}>
                <div className={css.half}></div>
                <h2 className={css.legendTitle}>
                    <FormattedMessage id="MapPage.legendTitle" />
                </h2>
                <div className={css.legendBlock}>
                    <img className={css.image} src={verified} alt="icon" />
                    <span className={css.legendLabel}>
                        <FormattedMessage id="MapPage.legendVerified" />
                    </span>
                </div>
                <div className={css.legendBlock}>
                    <img className={css.image} src={retail} alt="icon" />
                    <span className={css.legendLabel}>
                        <FormattedMessage id="MapPage.legendRetail" />
                    </span>
                </div>
                <div className={css.legendBlock}>
                    <img className={css.image} src={dining} alt="icon" />
                    <span className={css.legendLabel}>
                        <FormattedMessage id="MapPage.legendDining" />
                    </span>
                </div>
                <div className={css.legendBlock}>
                    <img className={css.image} src={art} alt="icon" />
                    <span className={css.legendLabel}>
                        <FormattedMessage id="MapPage.legendArt" />
                    </span>
                </div>
                <div className={css.legendBlock}>
                    <img className={css.image} src={work} alt="icon" />
                    <span className={css.legendLabel}>
                        <FormattedMessage id="MapPage.legendProfessional" />
                    </span>
                </div>
                <div className={css.legendBlock}>
                    <img className={css.image} src={bed} alt="icon" />
                    <span className={css.legendLabel}>
                        <FormattedMessage id="MapPage.legendTourism" />
                    </span>
                </div>
                <div className={css.legendBlock}>
                    <img className={css.image} src={people} alt="icon" />
                    <span className={css.legendLabel}>
                        <FormattedMessage id="MapPage.legendNonprofits" />
                    </span>
                </div>
                <div className={css.legendBlock}>
                    <img className={css.image} src={fitness} alt="icon" />
                    <span className={css.legendLabel}>
                        <FormattedMessage id="MapPage.legendBeauty" />
                    </span>
                </div>
                <div className={css.legendBlock}>
                    <img className={css.image} src={other} alt="icon" />
                    <span className={css.legendLabel}>
                        <FormattedMessage id="MapPage.legendOther" />
                    </span>
                </div>
            </div>
        );
    }
}

export default MapLegend;
