<template>
  <swiper>
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import {Swiper,SwiperItem} from 'components/swiper'
export default {
  name: "HomeSwiper",
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isLoad: false
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {
    imageLoad(){
      //这样就只发送了一次
      if(!this.isLoad){
        //发现发送了三次
        this.$emit('swiperImageLoad')
        this.isLoad = true
      }

    }
  }
}
</script>

<style scoped>

</style>
