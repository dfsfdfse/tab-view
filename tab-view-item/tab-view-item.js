// tab-view-item/tab-view-item.js
Component({
  relations:{
    "../tab-view/tab-view":{
      type:'parent',
      linked(target) {
        this.setData({parentTarget:target});
      }
    }
  },
  lifetimes:{
    ready() {
      this.createSelectorQuery().select('.tab-view-item-default').boundingClientRect(res=>{
        let {scrollContainerWidth,containerHeight} = this.data.parentTarget.data;
        this.setData({scrollContainerWidth:scrollContainerWidth,selfContainerHeight:containerHeight-res.height});
      }).exec();
    }
  },
  pageLifetimes:{
    
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title:{type:String,value:'未配置'},
    itemClass:{
      type:String
    },
    scrollContainerWidth:{
      type:String
    },
    scrollContainerHeight:{
      type:String
    },
    isFlex:{
      type:Boolean,
      value:false
    },
    canScroll:{
      type:Boolean,
      value:true,
    },
    canScrollX:{
      type:Boolean,
      value:false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    parentTarget:{},
    selfContainerHeight:0
  },
  options:{
    addGlobalClass:true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    itemScroll(e){
      let {childCanScroll} = this.data.parentTarget.data;
      this.triggerEvent('scroll',e);
      this.setData({canScroll:childCanScroll});
    }
  }
})
