const { override, useBabelRc, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc(),

    addWebpackModuleRule({
        test: /\.(sc|c|sa)ss$/,
        use: [
            {
                loader: 'style-loader',
            },
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                    importLoaders: 2,
                },
            },
            // You have to put it after `css-loader` and before any `pre-precessing loader`
            { loader: 'scoped-css-loader' },
            {
                loader: 'sass-loader',
            },
        ],
    }),
);
