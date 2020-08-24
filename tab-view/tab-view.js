// tab-view/tab-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titles:{
      type:Array,
      value:['苹果','香','梨子','桃子','西瓜','葡萄','橙子']
    },
    tabBarClass:{
      type:String,
      value:''
    },
    tabBarWidth:{
      type:Number,
      value:0
    },
    activeTab:{
      type:Number,
      value:0
    },
    containerHeight:{
      type:Number,
      value:500
    },
    containerWidth:{
      type:Number,
      value:0
    },
    scrollContainerWidth:{
      type:Number,
      value:0
    }
  },
  externalClasses:['tabBarClass'],
  options:{
    addGlobalClass:true
  },
  lifetimes: {
    ready() {
      let {containerWidth,tabBarWidth,scrollContainerWidth} = this.data;
      let query = this.createSelectorQuery(),windowWidth = wx.getSystemInfoSync().windowWidth;
      containerWidth = containerWidth||windowWidth;
      tabBarWidth=tabBarWidth||containerWidth;
      scrollContainerWidth = scrollContainerWidth||containerWidth;
      this.setData({windowWidth:windowWidth, containerWidth:containerWidth, tabBarWidth:tabBarWidth, scrollContainerWidth:scrollContainerWidth})
      query.selectAll('.tab-title-default').boundingClientRect(res=>{
        this.setData({lineWidth:res.map(d=>d.width),leftArray:res.map(d=>d.left)});
      }).exec();
      query.select('.tab-bar').boundingClientRect(res=>{
        this.setData({tabBarHeight:res.height,tabBarLeft:res.left});
      }).exec();

    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    tabBarHeight:0,
    tabBarLeft:0,
    lineWidth:[0],
    leftArray:[0],
    isAnimate:true,
    windowWidth:0,
    tabScrollLeft:0,
    tabScrollLineGo:0,
    tabLeft:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabScroll(e){
      this.setData({tabLeft:e.detail.scrollLeft})
    },
    tapTabBar(e){
      let activeTab = e.currentTarget.dataset.index;
      let {scrollContainerWidth} = this.data;
      this.setData({activeTab: activeTab,tabScrollLeft:scrollContainerWidth*activeTab});
    },
    tabBarScrollStart(e){
      this.startX  = this.goX = e.touches[0].clientX,this.startY = e.touches[0].clientY;
      this.tabStartTime = e.timeStamp;
      this.tabsCount = this.data.titles.length;
      this.setData({isAnimate:false});
    },
    tabBarScrollMove(e){
      let x = e.touches[0].clientX;
      let moveX = this.startX - x;
      this.startX = x;
      let hasGo = this.goX - x;
      let {lineWidth,activeTab,scrollContainerWidth,tabScrollLineGo} = this.data;
      if(hasGo>=0){
        tabScrollLineGo = (lineWidth[activeTab+1]/scrollContainerWidth)*hasGo;
      }else {
        tabScrollLineGo = (lineWidth[activeTab-1]/scrollContainerWidth)*hasGo
      }
      let offset = this.data.tabScrollLeft,
          maxOffset = this.data.scrollContainerWidth*(this.tabsCount-1)
      offset+=moveX;
      if(offset<=0){
        offset = 0;
        tabScrollLineGo = 0;
      }else if(offset>=maxOffset){
        offset = maxOffset;
        tabScrollLineGo = 0
      }
      this.setData({tabScrollLeft:offset,tabScrollLineGo:tabScrollLineGo});
    },
    tabBarScrollEnd(e){
      let {clientX} = e.changedTouches[0];
      let endTime = e.timeStamp,goTime = endTime - this.tabStartTime,changedX = this.goX-clientX;
      let {activeTab,tabScrollLeft,scrollContainerWidth,tabLeft,tabBarWidth,lineWidth,initLeftArray} = this.data;
      //滑动距离大于  100  或者 滑动速度  大于 0.35 进行翻页
      if((changedX>100||(goTime>130&&changedX/goTime>0.4))&&activeTab<this.tabsCount-1){
        activeTab++;
      }else if((changedX<-130||(goTime>100&&changedX/goTime<-0.4))&&activeTab>0){
        activeTab--;
      }
      tabScrollLeft = scrollContainerWidth*activeTab;
      this.setData({activeTab:activeTab,tabScrollLeft:tabScrollLeft,isAnimate:true,tabScrollLineGo:0});
    }
  }
})
