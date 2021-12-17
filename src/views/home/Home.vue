<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control
        :titles="['流行','新款','精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from 'components/common/navbar/NavBar';
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import {getHomeMultidata,getHomeGoods} from "network/home";

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0,list: []},
          'new': {page: 0,list: []},
          'sell': {page: 0,list: []},
        },
        //默认当前的类型是pop
        currentType: 'pop',
        isShowBackTop: 'false',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    //销毁
    destroyed() {
      console.log('home destroyed');
    },
    //开始
    activated() {
      console.log('activated')
      this.$refs.scroll.scrollTo(0,-this.saveY,0)
      //刷新
      this.$refs.scroll.refresh()
    },
    //离开
    deactivated() {
      console.log('deactivated')
      this.saveY = this.$refs.scroll.getScrollY()
    },
    //一般created()里面只写主要逻辑，将方法抽离到methods
    created() {
      //1.请求多个数据
      this.getHomeMultidata()
      // console.log(this.result); 请求不到

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      //1.图片完成加载的事件监听
      //3.监听item中图片加载完成
      //refresh这个局部变量不会被销毁
      const refresh = this.debounce(this.$refs.scroll.refresh,500)
      this.$bus.$on('itemImageLoad',() => {
        // console.log('-------');
        // this.scroll && this.$refs.scroll.refresh()
        refresh()
      })

      //2.获取tabControl的offsetTop
      //所有的组件都有一个属性$el,用于获取组件中的元素
      //但是这样拿并不包括图片的长度,我们应当等到图片加载完再计算
      // this.tabOffsetTop
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      debounce(func,delay){
        let timer = null
        return function (...args) {
          if(timer) clearTimeout(timer)
          timer = setTimeout(() => {
            func.apply(this,args)
          },delay)
        }
      },
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick(){
        //拿到scroll组件,拿scroll属性,调用sctoll属性的scrollTo方法
        // this.$refs.scroll.scroll.scrollTo(0,0,500)
        this.$refs.scroll.scrollTo(0,0,500)
      },
      contentScroll(position) {
        //1.判断BackTop是否显示
        this.isShowBackTop = -position.y > 1000
        //2.决定tabControl是否吸顶（position: fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore(){
        //图片加载完
        this.getHomeGoods(this.currentType)
        //调用刷新
        this.$refs.scroll.scroll.refresh()
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      /**
       * 网络请求相关方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
            // console.log(res);
            // this.result = res;
            this.banners = res.data.banner.list;
            this.recommends = res.data.recommend.list;
          })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          //完成上拉加载
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>
<!--属性scoped作用在于当前样式只会对当前的组件有效-->
<style scoped>
  #home {
    /*padding-top: 44px;*/
    height:98vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: white;

    /*使用浏览器原生滚动时，为了不让导航跟着滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
  /*.fixed {*/
  /*  position: fixed;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*  top: 44px;*/
  /*}*/
  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>

