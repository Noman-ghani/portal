module.exports = {
    chainWebpack: config => {
        config
        .plugin("html")
        .tap(args => {
            args[0].title = "Servu - Helping You Grow Your Business"
            return args
        })
        config
        .performance
        .maxEntrypointSize(400000)
        .maxAssetSize(400000)
    },
    configureWebpack: {
        devServer: {
            watchOptions: {
                ignored: ['node_modules'],
                aggregateTimeout: 300,
                poll: 1000
            }
        }
    }
}