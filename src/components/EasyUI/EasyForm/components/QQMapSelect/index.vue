<template>
  <div>
    <div style="overflow: hidden;">
      <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true">
            <el-form-item>
              <el-input
                v-model="inputVal"
                placeholder="请输入地点详细信息"
                style="width: 300px;"
                @keyup.native="inputChange"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查找</el-button>
            </el-form-item>
            <el-form-item>
              <el-form-item label="已选经纬度">
                <el-input v-model="latlngCurrent" placeholder="坐标值" style="width: 246px;" />
              </el-form-item>
            </el-form-item>
          </el-form>
        </el-col>
      </section>
    </div>
    <div class="mapWrap" :style="{height: height + 'px'}">
      <div id="qqmapCont" class="qqmap" :style="{height: height + 'px'}" />
      <div class="lngTips" />
    </div>
  </div>

</template>

<script>
window.qq = null
const ZOOM = 16
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          longitude: '113.32465589046478',
          latitude: '23.141968078619932'
        }
      }
    },

    /**
     * 地图高度
     */
    height: {
      type: Number,
      default: 400
    },

    mapcenter: {
      type: String,
      default: '23.141968078619932,113.32465589046478'
    },

    oldmarker: {
      type: String,
      default: '23.141968078619932,113.32465589046478'
    },

    inputDefault: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      qqmap: '',
      premarker: '',
      marker: '',
      inputVal: '',
      latlngCurrent: ''
    }
  },
  watch: {
    oldmarker(newVal, oldVal) {
      if (newVal) {
        console.log(typeof newVal)
        this.latlngCurrent = newVal
        this.qqmap && this.createMarker()
      }
    },
    inputDefault(newVal, oldVal) {
      console.log('默认地址变成：', newVal)
      this.inputVal = newVal
    },

    value(val) {
      this.latlngCurrent = val.latitude + ',' + val.longitude
      this.oldmarker = this.latlngCurrent
    }
  },
  mounted() {
    const that = this
    this.inputVal = this.inputDefault
    if (this.oldmarker) {
      this.latlngCurrent = this.oldmarker || this.mapcenter
    }

    if (!qq) {
      this.loadQQmap()
    } else {
      that.createMap()
    }

    // if (typeof (qq) === 'object') {
    //   that.createMap()
    // } else {
    //   this.loadQQmap()
    // }
    window.onMapFileLoad = function() {
      console.log('qqmap 加载完成')
      that.createMap()
    }
  },
  methods: {
    /**
     * 加载腾讯地图
     */
    loadQQmap() {
      const script = document.createElement('script')
      // 设置标签的type属性
      script.type = 'text/javascript'
      // 设置标签的链接地址
      // script.src = 'https://map.qq.com/api/js?v=2.exp&callback=onMapFileLoad'
      script.src = 'https://map.qq.com/api/js?v=2.exp&key=KJQBZ-PDFCW-D2HR6-OJ63N-W7UGT-LAFMU&&callback=onMapFileLoad'
      // 添加标签到dom
      document.body.appendChild(script)
    },

    /**
     * 查找地点
     */
    search() {
      const that = this
      // 调用地址解析类
      const geocoder = new qq.maps.Geocoder({
        error: function(res) {
          that.$message.error('腾讯地图查询出错，可能原因：本地区查找不到目标地点')
        },
        complete: function(result) {
          console.log('查找地点', result)
          that.qqmap.setCenter(result.detail.location)
          that.qqmap.setZoom(ZOOM)
        }
      })
      const address = this.inputVal
      // 通过getLocation();方法获取位置信息值
      console.log('搜索地址：', address)
      geocoder.getLocation(address)
    },

    /**
     * 输入变更
     */
    inputChange() {
      this.$emit('addr', this.inputVal) // 地图点击坐标 传递给父组件
    },

    /**
     * 创建地图
     */
    createMap() {
      const that = this
      this.qqmap = new qq.maps.Map(document.getElementById('qqmapCont'), {
        center: new qq.maps.LatLng(that.mapcenter.split(',')[0], that.mapcenter.split(',')[1]), // 地图的中心地理坐标。
        zoom: ZOOM // 地图的中心地理坐标。
      })
      setTimeout(() => {
        this.createMarker()
        this.bindMapEvent()
      }, 500)
    },

    /**
     * 创建标记点
     */
    createMarker() {
      const that = this
      if (that.premarker) {
        that.premarker.setMap(null)
      }
      if (this.oldmarker) {
        console.log('编辑模式：', this.oldmarker)
        that.qqmap.setCenter(new qq.maps.LatLng(that.oldmarker.split(',')[0], that.oldmarker.split(',')[1]))
        that.premarker = new qq.maps.Marker({
          position: new qq.maps.LatLng(that.oldmarker.split(',')[0], that.oldmarker.split(',')[1]),
          map: that.qqmap
        })
      } else {
        // 获取城市列表接口设置中心点
        const citylocation = new qq.maps.CityService({
          complete: function(result) {
            that.qqmap.setCenter(result.detail.latLng)
          }
        })
        // 调用searchLocalCity();方法
        citylocation.searchLocalCity()
      }
    },

    /**
     * 绑定地图事件
     */
    bindMapEvent() {
      const that = this
      // 地图点击事件
      qq.maps.event.addListener(that.qqmap, 'click', function(event) {
        that.marker && that.marker.setMap(null)
        that.premarker && that.premarker.setMap(null)
        that.$emit('mapclick', event.latLng) // 地图点击坐标 传递给父组件
        that.latlngCurrent = event.latLng.lat + ',' + event.latLng.lng
        that.$emit('input', {
          longitude: event.latLng.lng,
          latitude: event.latLng.lat
        })
        that.marker = new qq.maps.Marker({
          position: event.latLng,
          map: that.qqmap
        })
      })
      // 地图鼠标滑动事件
      const $lngTipsBox = document.querySelector('.lngTips')
      const mapBoxWidth = window.getComputedStyle(document.querySelector('.mapWrap')).width
      qq.maps.event.addListener(that.qqmap, 'mousemove', function(event) {
        $lngTipsBox.style.display = 'block'
        $lngTipsBox.style.top = (event.pixel.y + 10) + 'px'
        $lngTipsBox.style.left = (event.pixel.x + 15) + 'px'
        $lngTipsBox.innerText = '点击选择此坐标：' + event.latLng.lat + ',' + event.latLng.lng
      })
      // 鼠标离开
      qq.maps.event.addListener(that.qqmap, 'mouseout', function(event) {
        $lngTipsBox.style.display = 'none'
      })
    }
  }
}
</script>

<style scoped>
  .qqmap {
    width: 100%;
    height: 300px;
  }

  .mapWrap {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    margin-top: 15px;
  }

  .lngTips {
    display: none;
    width: 255px;
    height: 40px;
    padding: 5px 7px;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 123456;
    background: #ffffff;
    border-radius: 5px;
    line-height: 20px;
    box-shadow: #eeeeee 1px 1px 3px;
    border: #eeeeee 1px solid;
    font-size: 12px;
  }
</style>
