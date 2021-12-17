<template>
  <div class="wrapper" ref="aaaa">
    <ul class="content">
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
      <li>分类分类</li>
    </ul>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Category",
    data(){
      return {
        scroll: null
      }
    },
    created() {
      //以下两个都不能写在created中，因为created在组件创建的时候就调用
      //而此时并没有<div>标签
      // 写法一
      // new BScroll(document.querySelector('标签'))
      // 写法二
      // this.scroll = new BScroll('.wrapper',{...})
    },
    mounted() {
      // this.scroll = new BScroll(this.$refs.aaaa)
      //或
      this.scroll = new BScroll(document.querySelector('.wrapper'),{
        probeType: 3,
        pullUpLoad: true
      })
      this.scroll.on('scroll',(position) => {
        console.log(position)
      })
      this.scroll.on('pullingUp',() => {
        console.log('上拉加载更多')
      })
    }
  }
</script>

<style scoped>
  .wrapper {
    height: 150px;
    background-color: coral;
    overflow: hidden;
    /*overflow-y: scroll;*/
  }
</style>




























