function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
Chart.plugins.register({
  beforeDraw: function(chartInstance) {
    var ctx = chartInstance.chart.ctx;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
  }
});
document.addEventListener('DOMContentLoaded', function(e) {
  // get data archive.
  let reqData = new XMLHttpRequest();
  reqData.open('get', 'data.txt', false);
  reqData.onload = function(e) {
    data = e.target.response;
  }
  reqData.onerror = function(e) {
    console.log(e);
  }
  reqData.send();
  // get status archive.
  let reqStts = new XMLHttpRequest();
  reqStts.open('get', 'status.txt', false);
  reqStts.onload = function(e) {
    stts = e.target.response;
  }
  reqStts.onerror = function(e) {
    console.log(e);
  }
  reqStts.send();
  // transform txt in object to make the status
  let sttsObject = [];
  let sttsTemp = stts.split('stts');
  for (let i = 1; i < sttsTemp.length; i++) {
    sttsObject.push(JSON.parse(sttsTemp[i]));
  }
  // transform txt in object to make the graphics
  let dataObject = [];
  let dataTemp = data.split('data');
  for (let i = 1; i < dataTemp.length; i++) {
    dataObject.push(JSON.parse(dataTemp[i]));
  }
  // accumulators of data
  let fullData = {};
  fullData.day = {};
  fullData.month = {};
  fullData.year = {};
  fullData.tech = {};
  fullData.proj = {};
  // accumulators of status
  let status = {};
  status.fullTime = 0;
  status.fullDay = 0;
  status.fullMonth = 0;
  status.fullYear = 0;
  status.fullTech = [];
  status.fullProj = [];
  status.fullKey = 0;
  // init limiters with default value
  let limitDay = 31;
  let limitDayTech = 31;
  let limitTechProj = 31;
  let limitMonth = 12;
  let limitYear = 25;
  // set up user limiters
  sessionStorage.getItem('day') ? limitDay = sessionStorage.getItem('day') : '';
  sessionStorage.getItem('dayTech') ? limitDayTech = sessionStorage.getItem('dayTech') : '';
  sessionStorage.getItem('techProj') ? limitTechProj = sessionStorage.getItem('techProj') : '';
  sessionStorage.getItem('month') ? limitMonth = sessionStorage.getItem('month') : '';
  sessionStorage.getItem('year') ? limitYear = sessionStorage.getItem('year') : '';
  // set data in inputs
  $('#inpDay').val(limitDay);
  $('#inpDayTech').val(limitDayTech);
  $('#inpTechProj').val(limitTechProj);
  $('#inpMonth').val(limitMonth);
  $('#inpYear').val(limitYear);
  // pass for all data
  dataObject.forEach(function(e, i) {
    let fullDate = e.date.split(" ");
    let day = fullDate[0];
    let hour = fullDate[1];
    let month = day.slice(0, 7);
    let year = day.slice(0, 4);
    // treats data
    // check the extensions to measure better the technologies
    // exclude when arrive 'none'extension
    if (e.tech.length < 5 && e.tech != "none" && e.tech != "") {
      // diary
      if (!fullData.day[day]) {
        fullData.day[day] = {
          data: {
            "date": day,
            "time": e.time,
          },
          proj: {},
          tech: {},
        };
        // full day
        status.fullDay++;
      } else {
        fullData.day[day].data.time += e.time;
      }
      // mountly
      if (!fullData.month[month]) {
        fullData.month[month] = {
          data: {
            "date": month,
            "time": e.time,
          }
        };
        // full month
        status.fullMonth++;
      } else {
        fullData.month[month].data.time += e.time;
      }
      // yearly
      if (!fullData.year[year]) {
        fullData.year[year] = {
          data: {
            "date": year,
            "time": e.time,
          },
        };
        // full day
        status.fullYear++;
      } else {
        fullData.year[year].data.time += e.time;
      }
      // total hours
      status.fullTime += e.time;
      // technology
      if (!fullData.tech[e.tech]) {
        fullData.tech[e.tech] = {
          data: {
            "tech": e.tech,
            "time": e.time,
          }
        };
        // full technology
        status.fullTech.push(e.tech);
      } else {
        fullData.tech[e.tech].data.time += e.time;
      }
      // Project
      if (!fullData.proj[e.project]) {
        fullData.proj[e.project] = {
          data: {
            "date": e.project,
            "time": e.time,
          },
          tech: {},
        };
        // full proj
        status.fullProj.push(e.project);
      } else {
        fullData.proj[e.project].data.time += e.time;
      }
      // technology per project
      if (!fullData.proj[e.project].tech[e.tech]) {
        fullData.proj[e.project].tech[e.tech] = {
          "tech": e.tech,
          "time": e.time,
          "date": day,
        };
      } else {
        fullData.proj[e.project].tech[e.tech].time += e.time;
      }
      // project per day
      if (!fullData.day[day].proj[e.project]) {
        fullData.day[day].proj[e.project] = {
          "proj": e.project,
          "time": e.time,
          "date": day,
        };
      } else {
        fullData.day[day].proj[e.project].time += e.time;
      }
      // technology per day
      if (!fullData.day[day].tech[e.tech]) {
        fullData.day[day].tech[e.tech] = {
          "tech": e.tech,
          "time": e.time,
          "date": day,
        };
      } else {
        fullData.day[day].tech[e.tech].time += e.time;
      }
      // keypresses
      (e.key) ? status.fullKey += e.key: '';
    }
  });
  // STATUS //
  // total hours
  document.getElementById('fullTime').innerHTML = (status.fullTime / 3600).toFixed(2);
  // total days
  document.getElementById('fullDay').innerHTML = status.fullDay;
  // total months
  document.getElementById('fullMonth').innerHTML = status.fullMonth;
  // total years
  document.getElementById('fullYear').innerHTML = status.fullYear;
  // total projects
  document.getElementById('fullProj').innerHTML = status.fullProj.length;
  // total technologies
  document.getElementById('fullTech').innerHTML = status.fullTech.length;
  // total keypresses
  document.getElementById('fullKey').innerHTML = status.fullKey;
  // AVERAGE //
  // hours per day
  document.getElementById('avgHoursDay').innerHTML = ((status.fullTime / 3600) / status.fullDay).toFixed(2);
  // days per month
  document.getElementById('avgDaysMonths').innerHTML = (status.fullDay / status.fullMonth).toFixed(2);
  // months per year
  document.getElementById('avgMonthsYears').innerHTML = (status.fullMonth / status.fullYear).toFixed(2);
  // technologies per project
  document.getElementById('avgTechProj').innerHTML = (status.fullTech.length / status.fullProj.length).toFixed(2);
  // keypress per hour
  document.getElementById('avgKeyHour').innerHTML = (status.fullTime > 3600) ? (status.fullKey / (status.fullTime / 3600)).toFixed(2) : 0;
  // ABOUT //
  // codetimetracker version
  document.getElementById('cttVersion').innerHTML = "v." + sttsObject[0].cttVersion;
  // sublime version
  document.getElementById('stVersion').innerHTML = "v." + sttsObject[0].stVersion;
  // arch
  document.getElementById('arch').innerHTML = sttsObject[0].arch;
  // platform
  document.getElementById('platform').innerHTML = sttsObject[0].platform;
  // PROJECTS BY DAY //
  let projDayGraph = {
    legend: {
      data: ['Total Hours'],
      x: 'center',
    },
    tooltip: {
      trigger: 'axis'
    },
    calculable: true,
    xAxis: [{
      name: '[Day]',
      type: 'category',
      boundaryGap: true,
      data: []
    }],
    yAxis: [{
      type: 'value',
      axisLabel: {
        formatter: '{value} hrs'
      }
    }],
    series: [{
      name: 'Total Hours',
      type: 'line',
      data: []
    }],
  };
  // adjust data for make the graphic
  Object.keys(fullData.day).forEach(function(e, i) {
    // adjust the quantity of days that will appear
    if (status.fullDay < limitDay || i >= status.fullDay - limitDay) {
      // insert the date
      projDayGraph.xAxis[0].data.push(fullData.day[e].data.date);
      // insert the time
      projDayGraph.series[0].data.push((fullData.day[e].data.time / 3600).toFixed(2));
      // projects per day
      let s = fullData.day[e].proj;
      // make the graphic of projects per day
      Object.keys(s).forEach(function(e, i) {
        let tt = findValue(projDayGraph.series, "name", e);
        if (!tt) {
          projDayGraph.series.push({
            name: e,
            data: [(s[e].time / 3600).toFixed(2)],
            type: 'bar'
          });
        } else {
          projDayGraph.series[tt].data.push((s[e].time / 3600).toFixed(2));
        }
      });
      // insert zero
      status.fullProj.forEach(function(e, i) {
        let tt = findValue(projDayGraph.series, "name", e);
        if (tt) {
          if (projDayGraph.series[tt].data.length < projDayGraph.xAxis[0].data.length) {
            projDayGraph.series[tt].data.push(0);
          }
        } else {
          projDayGraph.series.push({
            name: e,
            data: [0],
            type: 'bar'
          });
        }
      });
    }
  });
  // make the legend
  status.fullProj.forEach(function(e, i) {
    projDayGraph.legend.data.push(e);
  });
  // show the graphic
  var myChart = echarts.init(document.getElementById('projDayGraph'));
  myChart.setOption(projDayGraph);
  // TECHNOLOGIES BY DAY //
  let techDayGraph = {
    legend: {
      data: ['Total Hours'],
      x: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    calculable: true,
    xAxis: [{
      name: '[Day]',
      type: 'category',
      boundaryGap: true,
      data: []
    }],
    yAxis: [{
      type: 'value',
      axisLabel: {
        formatter: '{value} hrs'
      }
    }],
    series: [{
      name: 'Total Hours',
      type: 'bar',
      data: []
    }],
  };
  // adjust data for tech by day graphic
  Object.keys(fullData.day).forEach(function(e, i) {
    // adjust the quantity of days that will appear
    if (status.fullDay < limitDayTech || i >= status.fullDay - limitDayTech) {
      // insert days
      techDayGraph.xAxis[0].data.push(fullData.day[e].data.date);
      // insert hours
      techDayGraph.series[0].data.push((fullData.day[e].data.time / 3600).toFixed(2));
      // insert projects in graphic day
      let s = fullData.day[e].tech;
      // mount tech by day
      Object.keys(s).forEach(function(e, i) {
        let tt = findValue(techDayGraph.series, "name", e);
        if (!tt) {
          techDayGraph.series.push({
            name: e,
            data: [(s[e].time / 3600).toFixed(2)],
            type: 'bar'
          });
        } else {
          techDayGraph.series[tt].data.push((s[e].time / 3600).toFixed(2));
        }
      });
      // insert zero
      status.fullTech.forEach(function(e, i) {
        let tt = findValue(techDayGraph.series, "name", e);
        if (tt) {
          if (techDayGraph.series[tt].data.length < techDayGraph.xAxis[0].data.length) {
            techDayGraph.series[tt].data.push(0);
          }
        } else {
          techDayGraph.series.push({
            name: e,
            data: [0],
            type: 'bar'
          });
        }
      });
    }
  });
  // make the legend of day graphic
  status.fullTech.forEach(function(e, i) {
    techDayGraph.legend.data.push(e);
  });
  // do the graphic and show
  var myChart = echarts.init(document.getElementById('techDayGraph'));
  myChart.setOption(techDayGraph);
  // TECHNOLOGY BY PROJECT //
  let techProjGraph = {
    legend: {
      data: ['Total Hours'],
      x: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    calculable: true,
    xAxis: [{
      name: '[Project]',
      type: 'category',
      boundaryGap: true,
      data: []
    }],
    yAxis: [{
      type: 'value',
      axisLabel: {
        formatter: '{value} hrs'
      }
    }],
    series: [{
      name: 'Total Hours',
      type: 'bar',
      data: []
    }],
  };
  // adjust data for tech by proj graphic
  Object.keys(fullData.proj).forEach(function(e, i) {
    if (status.fullProj.length < limitTechProj || i >= status.fullProj.length - limitTechProj) {
      // insert proj
      techProjGraph.xAxis[0].data.push(fullData.proj[e].data.date);
      // insert hours
      techProjGraph.series[0].data.push((fullData.proj[e].data.time / 3600).toFixed(2));
      // insert proj in tech
      let s = fullData.proj[e].tech;
      Object.keys(s).forEach(function(e, i) {
        let tt = findValue(techProjGraph.series, "name", e);
        if (!tt) {
          techProjGraph.series.push({
            name: e,
            data: [(s[e].time / 3600).toFixed(2)],
            type: 'bar'
          });
        } else {
          techProjGraph.series[tt].data.push((s[e].time / 3600).toFixed(2));
        }
      });
      // insert zero
      status.fullTech.forEach(function(e, i) {
        let tt = findValue(techProjGraph.series, "name", e);
        if (tt) {
          if (techProjGraph.series[tt].data.length < techProjGraph.xAxis[0].data.length) {
            techProjGraph.series[tt].data.push(0);
          }
        } else {
          techProjGraph.series.push({
            name: e,
            data: [0],
            type: 'bar'
          });
        }
      });
    }
  });
  // make the legend of tech graphic
  status.fullTech.forEach(function(e, i) {
    techProjGraph.legend.data.push(e);
  });
  // mount graphic and show
  var myChart = echarts.init(document.getElementById('techProjGraph'));
  myChart.setOption(techProjGraph);
  // TOTAL HOURS by PROJECT GRAPHIC  //
  var ctxProjGraph = document.getElementById('projGraph').getContext('2d');
  var data = {
    datasets: [{
      data: [],
      backgroundColor: []
    }],
    labels: []
  }
  // adjust data for proj graphic
  Object.keys(fullData.proj).forEach(function(e, i) {
    data.datasets[0].data.push((fullData.proj[e].data.time / 3600).toFixed(2));
    data.datasets[0].backgroundColor.push(getRandomColor());
    data.labels.push(e);
  });
  // mount and show
  window.totalHoursChart = new Chart(ctxProjGraph, {
    type: 'pie',
    options: {
      legend: {
        reverse: true
      },
      pieceLabel: {
        // mode 'label', 'value' or 'percentage', default is 'percentage'
        render: function(args){
        	return args.label+' - '+args.value
        },
        // precision for percentage, default is 0
        precision: 0,
        // font size, default is defaultFontSize
        fontSize: 12,
        // font color, default is '#fff'
        fontColor: '#fff',
        // font style, default is defaultFontStyle
        fontStyle: 'bold',
        // font family, default is defaultFontFamily
        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
      }
    },
    data: data
  });
  // TOTAL HOURS by TECHNOLOGY GRAPHIC //
  var ctxTechGraph = document.getElementById('techGraph').getContext('2d');
  var data = {
    datasets: [{
      data: [],
      backgroundColor: []
    }],
    labels: []
  }
  // adjust data for tech graphic
  Object.keys(fullData.tech).forEach(function(e, i) {
    data.datasets[0].data.push((fullData.tech[e].data.time / 3600).toFixed(2));
    data.datasets[0].backgroundColor.push(getRandomColor());
    data.labels.push(e);
    // techGraph.legend.data.push(e);
  });
  window.totalHoursByTech = new Chart(ctxTechGraph, {
    type: 'pie',
    options: {
      legend: {
        reverse: true
      }
    },
    data: data
  });
  // mount and show
  // var myChart = echarts.init(document.getElementById('techGraph'));
  // myChart.setOption(techGraph);
  // MONTH GRAPHIC  //
  let monthGraph = {
    title: {
      subtext: 'Total hours worked in month',
      x: 'center'
    },
    legend: {
      data: [],
      x: 'left'
    },
    tooltip: {
      trigger: 'axis'
    },
    calculable: true,
    xAxis: [{
      name: '[Month]',
      type: 'category',
      boundaryGap: true,
      data: []
    }],
    yAxis: [{
      type: 'value',
      axisLabel: {
        formatter: '{value} hrs'
      }
    }],
    series: [{
      name: 'Total Hours',
      type: 'line',
      data: []
    }],
  }
  // adjust data for month graphic
  Object.keys(fullData.month).forEach(function(e, i) {
    // adjust the quantity of months that will appear
    if (status.fullMonth < limitMonth || i >= status.fullMonth - limitMonth) {
      // insert months
      monthGraph.xAxis[0].data.push(fullData.month[e].data.date);
      // insert hours
      monthGraph.series[0].data.push((fullData.month[e].data.time / 3600).toFixed(2));
    }
  });
  // mount and show
  var myChart = echarts.init(document.getElementById('monthGraph'));
  myChart.setOption(monthGraph);
  // YEAR GRAPHIC //
  let yearGraph = {
    title: {
      subtext: 'Total hours worked in year',
      x: 'center'
    },
    legend: {
      data: [],
      x: 'left'
    },
    tooltip: {
      trigger: 'axis'
    },
    calculable: true,
    xAxis: [{
      name: '[Year]',
      type: 'category',
      boundaryGap: true,
      data: []
    }],
    yAxis: [{
      type: 'value',
      axisLabel: {
        formatter: '{value} hrs'
      }
    }],
    series: [{
      name: 'Total Hours',
      type: 'bar',
      data: []
    }],
  }
  // adjust data for yaer graphic
  Object.keys(fullData.year).forEach(function(e, i) {
    // adjust the quantity of years that will appear
    if (status.fullYear < limitYear || i >= status.fullYear - limitYear) {
      // insert the years
      yearGraph.xAxis[0].data.push(fullData.year[e].data.date);
      // insert hours
      yearGraph.series[0].data.push((fullData.year[e].data.time / 3600).toFixed(2));
    }
  });
  // mount and show
  var myChart = echarts.init(document.getElementById('yearGraph'));
  myChart.setOption(yearGraph);
  console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
  console.log("┃               CodeTimeTracker v" + sttsObject[0].cttVersion + "               ┃");
  console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");
});