<template>
  <div>
    <el-row :gutter="14" style="margin: 15px 0 25px 0">
      <el-col :span="10" :offset="2">
        <div class="col-item">
          <el-row class="title">
            <el-col>
              <h3>商品总览</h3>
            </el-col>
          </el-row>
          <el-row type="flex" class="item-content">
            <el-col>
              <p class="num">100</p>
              <p>已下架</p>
            </el-col>
            <el-col>
              <p class="num">400</p>
              <p>已上架</p>
            </el-col>
            <el-col>
              <p class="num">50</p>
              <p>库存紧张</p>
            </el-col>
            <el-col>
              <p class="num">500</p>
              <p>全部商品</p>
            </el-col>
          </el-row>
        </div>
      </el-col>

      <el-col :span="10">
        <div class="col-item">
          <el-row class="title">
            <el-col>
              <h3>用户总览</h3>
            </el-col>
          </el-row>
          <el-row type="flex" class="item-content">
            <el-col>
              <p class="num">100</p>
              <p>今日新增</p>
            </el-col>
            <el-col>
              <p class="num">200</p>
              <p>昨日新增</p>
            </el-col>
            <el-col>
              <p class="num">1000</p>
              <p>本月新增</p>
            </el-col>
            <el-col>
              <p class="num">5000</p>
              <p>会员总数</p>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <div id="main"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  mounted() {
    let myChart = echarts.init(document.getElementById("main"));
    const option = {
      title: {
        text: "订单数量",
      },
      legend: {
        data: ["近一周订单数量"],
      },
      tooltip: {
        trigger: "axis", // 坐标轴触发tips
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      color: ["red"],
      xAxis: {
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        boundaryGap: false,
      },
      yAxis: {
        max: 1000,
      },
      series: [
        {
          name: "近一周订单数量",
          type: "line",
          data: [560, 600, 500, 300, 400, 700, 800],
        },
      ],
    };
    myChart.setOption(option);
  },
};
</script>

<style lang="">
.col-item {
  border: 1px solid #000;
}
.item-content {
  text-align: center;
}
.title {
  padding-left: 15px;
  height: 45px;
  line-height: 45px;
  color: rgb(112, 110, 110);
}
.num {
  color: rgb(235, 69, 102);
  font-size: 24px;
  font-weight: 600;
}
#main {
  width: 750px;
  height: 550px;
  margin: 0 auto;
}
</style>