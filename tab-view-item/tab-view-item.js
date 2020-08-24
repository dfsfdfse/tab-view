// tab-view-item/tab-view-item.js
Component({
  relations:{
    "../tab-view/tab-view":{
      type:'parent',
      linked(target) {
        this.setData({parentTarget:target})
      }
    }
  },
  lifetimes:{
    ready() {
        let {scrollContainerWidth} = this.data.parentTarget.data;
        this.setData({scrollContainerWidth:scrollContainerWidth});
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    scrollContainerWidth:{
      type:Number
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    parentTarget:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeCurrent(e){
      console.log(e);
    },
    getComponentWidth(e){
      console.log(e);
    }
  }
})
