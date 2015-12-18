import React from 'react';
import DefaultRawTheme from '../styles/raw-themes/dark-raw-theme';
import ThemeManager from '../styles/theme-manager';

// Putting this out here for cache-ability
let defaultTheme;
function getDefaultTheme() {
  return defaultTheme || (defaultTheme = ThemeManager.getMuiTheme(DefaultRawTheme));
}

export default function(Component) {
  const ref = 'childComponent';
  const config = {
    contextTypes: {
      muiTheme: React.PropTypes.object,
    },

    childContextTypes: {
      muiTheme: React.PropTypes.object,
    },

    getChildContext() {
      return this.context;
    },

    render() {
      const muiTheme = this.context.muiTheme || getDefaultTheme();
      return React.createElement(Component, {...this.props, muiTheme, ref} );
    },
  };

  // Create a proxy for each of the public methods
  // the component provides in it's statics.publicMethods
  if (Array.isArray(Component.publicMethods)) {
    Component.publicMethods.forEach(methodName => {
      config[methodName] = function() {
        this.refs[ref][methodName]();
      };
    });
  }

  // return themed component wrapper
  return React.createClass(config);
}
