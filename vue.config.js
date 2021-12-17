module.exports = {
    configureWebpack: {
        resolve: {
            //设置省略后缀，脚手架3已经自动帮我们设置了，所以不需要
            // extensions: [],

            //设置别名
            alias:{
                //系统内部已经自动设置@表示src
                '@': '/src',
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                //router和store不需要配置，因为所有的文件都可通过
                // this.$router、this.$store拿到对象
                'views':　'@/views',
            },

        }
    }
}
