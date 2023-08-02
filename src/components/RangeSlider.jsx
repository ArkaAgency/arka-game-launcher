import React from 'react';
import ReactSlider from 'react-slider';
import PropTypes from 'prop-types';

export function RangeSlider(props) {
    return <ReactSlider className='w-full' {...props} />;
}
RangeSlider.propTypes = {
    props: PropTypes.obj
};