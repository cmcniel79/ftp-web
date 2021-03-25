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
import chevron from '../../assets/chevron-down-outline.svg';

import css from './MapPage.module.css';

export class MapLegend extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: true,
        };
    }

    getLegendImage(industry) {
        // { key: 'retail', label: "Retail" },
        // { key: 'dining', label: "Dining" },
        // { key: 'art', label: "Art and Photography" },
        // { key: 'professional', label: "Professional Services" },
        // { key: 'hospitality', label: "Hospitality and Tourism" },
        // { key: 'nonprofit', label: "Nonprofit" },
        // { key: 'beauty', label: "Beauty and Personal Services" },
        // { key: 'other', label: "Other" },
        switch (industry) {
            case 'retail':
                return retail;
            case 'dining':
                return dining;
            case 'art':
                return art;
            case 'professional':
                return work;
            case 'hospitality':
                return bed;
            case 'nonprofit':
                return people;
            case 'beauty':
                return fitness;
            case 'other':
                return other;
        }
    }

    render() {
        const { className, onSelect, options, selected } = this.props;
        const panelClassNames = this.state.isOpen ? css.panelOpened : css.panelClosed;
        const chevronClasses = this.state.isOpen ? css.chevronDown : css.chevronUp;
        return (
            <div className={className}>
                <div className={css.legendTitleContainer} onClick={() => this.setState(prevState => ({ isOpen: !prevState.isOpen }))}>
                    <h2 className={css.legendTitle}>
                        <FormattedMessage id="MapPage.legendTitle" />
                    </h2>
                    <img className={chevronClasses} src={chevron} alt="chevron" />
                </div>
                <div className={panelClassNames}>
                    <div className={selected === 'verified' ? css.legendBlockSelected : css.legendBlock} onClick={() => onSelect('verified')}>
                        <img className={css.legendImage} src={verified} alt="icon" />
                        <span className={css.legendLabel}>
                            <FormattedMessage id="MapPage.legendVerified" />
                        </span>
                    </div>
                    {options && options.map(i =>
                        <div key={i.key} className={selected === i.key ? css.legendBlockSelected : css.legendBlock} onClick={() => onSelect(i.key)}>
                            <img className={css.legendImage} src={this.getLegendImage(i.key)} alt="icon" />
                            <span className={css.legendLabel}>
                                {i.label}
                            </span>
                        </div>
                    )}
                    <button className={css.clearButton} onClick={e => onSelect(null)}>
                        <FormattedMessage id='NativeLand.plainClear' />
                    </button>
                </div>
            </div>
        );
    }
}

export default MapLegend;
