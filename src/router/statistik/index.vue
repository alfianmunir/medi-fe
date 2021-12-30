<script>
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config"; 

import { mapState, mapActions } from 'vuex';
import moment from 'moment';

import ECharts from "vue-echarts";
import "echarts/lib/chart/line";

import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/polar";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/grid";
import "echarts/lib/component/axis";

const lineChart = {
    // Setup grid
    grid: {
        zlevel: 0,
        x: 50,
        x2: 50,
        y: 30,
        y2: 30,
        borderWidth: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,0,0,0)',
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: {
            lineStyle: {
                color: '#8791af'
            },
        },
    },
    yAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: '#8791af'
            },
        },
        splitLine: {
            lineStyle: {
                color: "rgba(166, 176, 207, 0.1)"
            }
        }
    },
    legend: {
        data: ['Pasien'],
        textStyle: {
            color: '#999'
        }
    },
    series: [{
        name: 'Pasien',
        type: 'line',
        stack: 'yes',
        smooth:true,
        itemStyle: {normal: {color:'blue'}},
        lineStyle: {color: '#2F80ED'},
        data: []
    }
    ]
};

export default {
  page: {
    title: "Statistik",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    PageHeader, "v-chart": ECharts
  },
  computed: {
    ...mapState('statistik', ['statistik_data']),
    pasiens: function(){
      return this.statistik_data?.pasiens 
    },
    obats: function(){
      return this.statistik_data?.obats
    },
    fees: function(){
      return this.statistik_data?.fees
    },
    time: function(){
      return (new Date()).getHours()
    },
    time_of_day:function(){
      let tod 
      if(this.time > 4 && this.time <= 10) tod = 'Selamat Pagi'
      else if(this.time > 10 && this.time <= 14) tod = 'Selamat Siang'
      else if(this.time > 14 && this.time <= 18) tod = 'Selamat Sore'
      else if (this.time > 18 ) tod = 'Selamat Malam'
      return tod
    }
  },
  mounted() {
    const payload = {
      year: moment().year(),
      month_id: moment().month()+1
    }
    this.getStatistikPasien(payload)
    this.getStatistikObat(payload)
    this.getStatistikFee(payload)
  },
  watch: {
    pasiens(val){
      if(val){
        this.filter_pasien.series = this.filter_pasien.day_list?.map((item) => {
          // console.log(val, 'pasiens')
          let temp = val.filter(v => v.tanggal == item)
          if(temp.length > 0) return temp[0].pasiens
          else return 0
        })
        this.pasienChart.series[0].data = this.filter_pasien.series
        this.pasienChart.xAxis.data = this.filter_pasien.day_list 
      }
    },
    fees(val){
      if(val){
        this.filter_fee.series = this.filter_fee.day_list?.map((item) => {
          let temp = val.filter(v => v.date == item)
          if(temp.length > 0) return temp[0].harga / 1000000
          else return 0
        })
        this.feeChart.series[0].data = this.filter_fee.series
        this.feeChart.xAxis.data = this.filter_fee.day_list 
      }
    },
    obats(val){
      if(val){
        this.filter_obat.series = this.filter_obat.day_list?.map((item) => {
          let temp = val.filter(v => v.date == item)
          if(temp.length > 0) return temp[0].harga / 1000000
          else return 0
        })
        this.obatChart.series[0].data = this.filter_obat.series
        this.obatChart.xAxis.data = this.filter_obat.day_list 
      }
    },
    filter_pasien: {
      deep: true,
      handle: function(val){
        if(val){ 
          this.getStatistikPasien({year:val.year, month_id: val.month})
          this.$forceUpdate()
        }
      }
    }
  },
  methods: { 
    ...mapActions('statistik', ['getStatistikFee', 'getStatistikPasien', 'getStatistikObat']),
    getDaysArray(year, month) {
      var monthIndex = month - 1; // 0..11 instead of 1..12 
      var date = new Date(year, monthIndex, 1);
      var result = [];
      while (date.getMonth() == monthIndex) {
        result.push(date.getDate());
        date.setDate(date.getDate() + 1);
      }
      return result;
    },
    onChangeMonth(event, idx){
      if(idx == 0){
        this.filter_pasien.day_list = this.getDaysArray(this.filter_pasien.year, event)
        this.getStatistikPasien({year:this.filter_pasien.year, month_id: event})
        this.pasienChart.xAxis.data = this.filter_pasien.day_list
      } else if(idx == 1){
        this.filter_fee.day_list = this.getDaysArray(this.filter_fee.year, event)
        this.getStatistikFee({year:this.filter_fee.year, month_id: event})
        this.feeChart.xAxis.data = this.filter_fee.day_list
      } else if(idx == 2){
        this.filter_obat.day_list = this.getDaysArray(this.filter_obat.year, event)
        this.getStatistikObat({year:this.filter_obat.year, month_id: event})
        this.obatChart.xAxis.data = this.filter_obat.day_list
      }
    }
  },
  data() {
    return {
        filter_pasien: {
          year: moment().year(),
          month: moment().month()+1,
          month_list: moment.months().map((item, idx) => ({
            text: item,
            value: idx+1
          })),
          series: [],
          year_list: [0,1,2,3,4,5].map(item => ({
            text: moment().year()-item,
            value: moment().year()-item
          })),
          day_list: this.getDaysArray(moment().year(), moment().month()+1)
        }, 
        filter_obat: {
          year: moment().year(),
          month: moment().month()+1,
          month_list: moment.months().map((item, idx) => ({
            text: item,
            value: idx+1
          })),
          series: [],
          year_list: [0,1,2,3,4,5].map(item => ({
            text: moment().year()-item,
            value: moment().year()-item
          })),
          day_list: this.getDaysArray(moment().year(), moment().month()+1)
        }, 
        filter_fee: {
          year: moment().year(),
          month: moment().month()+1,
          month_list: moment.months().map((item, idx) => ({
            text: item,
            value: idx+1
          })),
          series: [],
          year_list: [0,1,2,3,4,5].map(item => ({
            text: moment().year()-item,
            value: moment().year()-item
          })),
          day_list: this.getDaysArray(moment().year(), moment().month()+1)
        }, 
        pasienChart: lineChart,
        obatChart: {...lineChart, series: [{
          name: 'Pendapatan',
          type: 'line',
          stack: 'yes',
          smooth:true,
          itemStyle: {normal: {color:'#EB5757'}},
          lineStyle: {color: '#EB5757'},
          data: []
        }
        ]},
        feeChart: {...lineChart, series: [{
          name: 'Pengeluaran Obat',
          type: 'line',
          stack: 'yes',
          smooth:true,
          itemStyle: {normal: {color:'#F2994A'}},
          lineStyle: {color: '#F2994A'},
          data: []
        }
        ]},
    };
  },
};
</script>

<template>
  <div>
    <PageHeader :title="'Statistik Klinik'"  />   
    
    <div :style="{}" class="card p-4 shadow" style="border:1px solid #EAEAEA">
      <div class="mb-3 d-flex flex-wrap align-items-center">
        <h4 class="mb-0 font-weight-bold mr-auto">Statistik Kunjungan Pasien (Pasien)</h4>
        <label class="mr-3 mb-0">Tampilkan berdasarkan</label>
        <b-form-select v-model="filter_pasien.month" @change="onChangeMonth($event, 0)" class="mx-3" style="max-width:100px" size="sm" :options="filter_pasien.month_list"></b-form-select>
        <b-form-select v-model="filter_pasien.year" size="sm" style="max-width:120px" :options="filter_pasien.year_list"></b-form-select>
      </div>

      <v-chart :options="pasienChart" class="w-100" />
      <h5 class="text-right">Total Pengunjung: <strong>{{statistik_data.pasiens_total}} pasien</strong></h5>
    </div>

    <div :style="{}" class="card p-4 shadow" style="border:1px solid #EAEAEA">
      <div class="mb-3 d-flex flex-wrap align-items-center">
        <h4 class="mb-0 font-weight-bold mr-auto">Statistik Pendapatan (juta rupiah)</h4>
        <label class="mr-3 mb-0">Tampilkan berdasarkan</label>
        <b-form-select v-model="filter_fee.month" @change="onChangeMonth($event, 1)" class="mx-3" style="max-width:100px" size="sm" :options="filter_fee.month_list"></b-form-select>
        <b-form-select v-model="filter_fee.year" size="sm" style="max-width:120px" :options="filter_fee.year_list"></b-form-select>
      </div>
      
      <v-chart :options="feeChart" class="w-100" />
      
      <h5 class="text-right">Total Pendapatan: <strong>Rp. {{new Intl.NumberFormat({ maximumSignificantDigits: 3 }).format(statistik_data.fees_total)}}</strong></h5>
    </div>

    <div :style="{}" class="card p-4 shadow" style="border:1px solid #EAEAEA">
      <div class="mb-3 d-flex flex-wrap align-items-center">
        <h4 class="mb-0 font-weight-bold mr-auto">Statistik Pengeluaran Obat (juta rupiah)</h4>
        <label class="mr-3 mb-0">Tampilkan berdasarkan</label>
        <b-form-select v-model="filter_obat.month" @change="onChangeMonth($event, 2)" class="mx-3" style="max-width:100px" size="sm" :options="filter_obat.month_list"></b-form-select>
        <b-form-select v-model="filter_obat.year" size="sm" style="max-width:120px" :options="filter_obat.year_list"></b-form-select>
      </div>

      <v-chart :options="obatChart" class="w-100" />
      <h5 class="text-right">Total Pengeluaran: <strong>Rp. {{new Intl.NumberFormat({ maximumSignificantDigits: 3 }).format(statistik_data.obats_total)}}</strong></h5>
    </div>

  </div>
</template>
 

<style>
.ct-series-a .ct-line {
  /* Set the colour of this series line */
  stroke: black; 
}
</style>