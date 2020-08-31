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
      let {parentTarget,scrollWidth} = this.data;
      let {scrollContainerWidth}=parentTarget.data;
      if(!scrollWidth){
        this.setData({scrollWidth:scrollContainerWidth})
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title:{type:String,value:'未配置'},
    itemClass:{
      type:String
    },
    scrollWidth:{
      type:String
    },
    scrollHeight:{
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
    parentTarget:undefined
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
