let {windowWidth, windowHeight} = wx.getSystemInfoSync()
Component({
  relations:{
    '../tab-view-item/tab-view-item':{
      type:'child',
      linked(target) {
        let {titles} = this.data;
        titles.push(target.data.title);
        this.setData({titles:titles});
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    tabBarFixedLeft:{
      type:Number,
      value:0
    },
    tabBarContainerStyle:{
      type:String,
      value:''
    },
    tabBarContainerClass:{
      type:String,
      value:''
    },
    tabBarClass:{
      type:String,
      value:''
    },
    tabBarWidth:{
      type:Number
    },
    activeTab:{
      type:Number,
      value:0
    },
    containerHeight:{
      type:Number,
      value:windowHeight
    },
    containerWidth:{
      type:Number,
      value:windowWidth
    },
    canChangePage:{
      type:Boolean,
      value:true
    },
    scrollContainerWidth:{
      type:Number
    }
  },
  options:{
    addGlobalClass:true
  },
  lifetimes: {
    ready() {
      let {containerHeight,containerWidth,tabBarWidth,scrollContainerWidth} = this.data;
      let query = this.createSelectorQuery();
      tabBarWidth = tabBarWidth||containerWidth;
      scrollContainerWidth = scrollContainerWidth||containerWidth;
      this.setData({windowWidth:windowWidth,windowHeight:windowHeight, tabBarWidth:tabBarWidth, scrollContainerWidth:scrollContainerWidth})
      query.selectAll('.tab-title').boundingClientRect(res=>{
        this.setData({lineWidth:res.map(d=>d.width),leftArray:res.map(d=>d.left)});
      }).exec();
      query.select('.tab-bar').boundingClientRect(res=>{
        this.triggerEvent('tabBarInit',res);
        this.setData({tabBarHeight:res.height,tabBarLeft:res.left});
      }).exec();
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    titles:[],
    tabBarHeight:0,
    tabBarLeft:0,
    lineWidth:[0],
    leftArray:[0],
    isAnimate:true,
    windowWidth:0,
    windowHeight:0,
    tabScrollLeft:0,
    tabScrollLineGo:0,
    tabLeft:0,
    childCanScroll:true
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
      let {clientX,clientY} = e.touches[0];
      let moveX = this.startX - clientX;
      this.startX = clientX;
      let hasGo = this.goX - clientX,hasGoY=this.startY-clientY;
      if(!this.goPosition){
        this.goPosition = Math.abs(hasGoY)>=Math.abs(hasGo)?'y':'x';
      }
      if(this.goPosition=='x'){
        let {lineWidth,activeTab,scrollContainerWidth,tabScrollLineGo} = this.data;
        tabScrollLineGo = (lineWidth[hasGo >= 0?activeTab+1:activeTab-1]/scrollContainerWidth)*hasGo;
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
        this.setData({tabScrollLeft:offset,tabScrollLineGo:tabScrollLineGo,childCanScroll:false});
      }
      this.triggerEvent('scrollMove',e);
    },
    tabBarScrollEnd(e){
      let {clientX,clientY} = e.changedTouches[0];
      let endTime = e.timeStamp,goTime = endTime - this.tabStartTime,changedX = this.goX-clientX,changedY = Math.abs(this.startY-clientY);
      let {canChangePage,activeTab,tabScrollLeft,scrollContainerWidth} = this.data;
      //滑动距离大于  140  或者 滑动速度  大于 0.4 进行翻页 canChangePage 是否能够通过滚动改变页签
      if(canChangePage){
        if((changedX>100||(changedX>70&&changedX/goTime>0.4))&&activeTab<this.tabsCount-1){
          activeTab++;
        }else if((changedX<-100||(changedX>70&&changedX/goTime<-0.4))&&activeTab>0){
          activeTab--;
        }
      }
      tabScrollLeft = scrollContainerWidth*activeTab;
      this.goPosition = undefined;
      this.setData({activeTab:activeTab,tabScrollLeft:tabScrollLeft,isAnimate:true,tabScrollLineGo:0,childCanScroll:true});
    },
    animate(animate){
      this.setData({isAnimate:animate})
    }
  }
})
