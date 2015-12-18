import React from 'react';
import DefaultRawTheme from '../styles/raw-themes/light-raw-theme';
import ThemeManager from '../styles/theme-manager';

// Putting this out here for cache-ability
let defaultTheme;
function getDefaultTheme() {
  return defaultTheme || (defaultTheme = ThemeManager.getMuiTheme(DefaultRawTheme));
}

function getDisplayName(WrappedComponent) {
  const originalName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  return `Themed_${originalName}`;
}

export default function(WrappedComponent) {
  const ref = 'childComponent';
  const config = {
    displayName: getDisplayName(WrappedComponent),

    contextTypes: {
      muiTheme: React.PropTypes.object,
    },

    childContextTypes: {
      muiTheme: React.PropTypes.object,
    },

    getChildContext() {
      return {
        muiTheme: this._getMuiTheme(),
      };
    },

    render() {
      const muiTheme = this._getMuiTheme();
      return React.createElement(WrappedComponent, {...this.props, muiTheme, ref} );
    },

    _getMuiTheme() {
      return this.props.muiTheme || this.context.muiTheme || getDefaultTheme();
    },
  };

  // Create a proxy for each of the public methods
  // the component provides in it's statics.publicMethods
  if (Array.isArray(WrappedComponent.publicMethods)) {
    WrappedComponent.publicMethods.forEach(methodName => {
      config[methodName] = function() {
        return this.refs[ref][methodName]();
      };
    });
  }

  // return themed component wrapper
  return React.createClass(config);
}
