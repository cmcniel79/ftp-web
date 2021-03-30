import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import {
    IconArt,
    IconBed,
    IconChevronDown,
    IconDining,
    IconFitness,
    IconOther,
    IconPeople,
    IconRetail,
    IconVerified,
    IconWork
} from '../../components';

import css from './MapPage.module.css';

export class MapLegend extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: true,
        };
    }

    getLegendImage(industry) {
        switch (industry) {
            case 'art':
                return <IconArt className={css.legendImage} isFilled={false} />
            case 'hospitality':
                return <IconBed className={css.legendImage} isFilled={false} />
            case 'dining':
                return <IconDining className={css.legendImage} isFilled={false} />
            case 'beauty':
                return <IconFitness className={css.legendImage} isFilled={false} />
            case 'other':
                return <IconOther className={css.legendImage} isFilled={false} />
            case 'nonprofit':
                return <IconPeople className={css.legendImage} isFilled={false} /> 
            case 'retail':
                return <IconRetail className={css.legendImage} isFilled={false} />
            case 'professional':
                return <IconWork className={css.legendImage} isFilled={false}/>
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
                    <IconChevronDown className={chevronClasses} />
                </div>
                <div className={panelClassNames}>
                    <div className={selected === 'verified' ? css.legendBlockSelected : css.legendBlock} onClick={() => onSelect('verified')}>
                        <IconVerified className={css.legendImage} isFilled={false}/>
                        <span className={css.legendLabel}>
                            <FormattedMessage id="MapPage.legendVerified" />
                        </span>
                    </div>
                    {options && options.map(i =>
                        <div key={i.key} className={selected === i.key ? css.legendBlockSelected : css.legendBlock} onClick={() => onSelect(i.key)}>
                            {this.getLegendImage(i.key, selected)}
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
