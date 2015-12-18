import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import StylePropable from '../mixins/style-propable';
import SlideInChild from './slide-in-child';
import themeable from '../styles/themeable-decorator';

const SlideIn = React.createClass({

  mixins: [StylePropable],

  propTypes: {
    childStyle: React.PropTypes.object,
    children: React.PropTypes.node,
    direction: React.PropTypes.oneOf(['left', 'right', 'up', 'down']),
    enterDelay: React.PropTypes.number,
    muiTheme: React.PropTypes.object.isRequired,

    /**
     * Override the inline-styles of the root element.
     */
    style: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      enterDelay: 0,
      direction: 'left',
    };
  },

  render() {
    let {
      enterDelay,
      children,
      childStyle,
      direction,
      style,
      ...other,
    } = this.props;

    let mergedRootStyles = this.prepareStyles({
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
    }, style);

    let newChildren = React.Children.map(children, (child) => {
      return (
        <SlideInChild
          key={child.key}
          direction={direction}
          enterDelay={enterDelay}
          getLeaveDirection={this._getLeaveDirection}
          style={childStyle}>
          {child}
        </SlideInChild>
      );
    }, this);

    return (
      <ReactTransitionGroup
        {...other}
        style={mergedRootStyles}
        component="div">
        {newChildren}
      </ReactTransitionGroup>
    );
  },

  _getLeaveDirection() {
    return this.props.direction;
  },

});

export default themeable(SlideIn);
