    // console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
    // console.log("┃     SublimeTime-tracker 1.0      ┃");
    // console.log("┠──────────────────────────────────┨");
    // console.log("┃          victorio.tk             ┃");
    // console.log("┃ victor.eduardo.barreto@gmail.com ┃");
    // console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");

    document.addEventListener('DOMContentLoaded', function(e){

    // get data archive.
    let reqData = new XMLHttpRequest();
    reqData.open('get', 'data.txt', false);

    reqData.onload = function(e){
        data = e.target.response;
    }

    reqData.onerror = function(e){
        console.log(e);
    }

    reqData.send();

    // get status archive.
    let reqStts = new XMLHttpRequest();
    reqStts.open('get', 'status.txt', false);

    reqStts.onload = function(e){
        stts = e.target.response;
    }

    reqStts.onerror = function(e){
        console.log(e);
    }

    reqStts.send();

    // transform txt in object to make the status
    let sttsObject = [];
    let sttsTemp = stts.split('stts');

    for(let i = 1; i < sttsTemp.length; i++) {

     sttsObject.push(JSON.parse(sttsTemp[i]));
 }

    // transform txt in object to make the graphics
    let dataObject = [];
    let dataTemp = data.split('data');

    for(let i = 1; i < dataTemp.length; i++) {

     dataObject.push(JSON.parse(dataTemp[i]));
 }

    // accumulators of data
    let fullData = {};
    fullData.day ={};
    fullData.month ={};
    fullData.year ={};
    fullData.tech ={};
    fullData.proj ={};

    // accumulators of status
    let status = {};
    status.fullTime = 0;
    status.fullDay = 0;
    status.fullMonth = 0;
    status.fullYear = 0;
    status.fullTech = [];
    status.fullProj = [];

    // limit
    let limitDay = 30;
    let limitMonth = 36;
    let limitYar = 30;

    // pass for all data
    dataObject.forEach(function(element, index) {

        let fullDate = element.date.split(" ");
        let day = fullDate[0];
        let hour = fullDate[1];
        let month = day.slice(0,7);
        let year = day.slice(0,4);

        // adjust for unkown technologies and projects
        ('' == element.tech)? element.tech = "unknown tech": '';
        ('none' == element.project)? element.project = "whitout project": '';

        // diary
        if(!fullData.day[day]){

            fullData.day[day] = {

                data: {
                    "date": day,
                    "time": element.time,
                },
                proj: {},
                tech: {},
            };

            // full day
            status.fullDay ++;

        }else{

            fullData.day[day].data.time += element.time;
        }

        // mountly
        if(!fullData.month[month]){

            fullData.month[month] = {

                data: {
                    "date": month,
                    "time": element.time,
                }
            };

            // full month
            status.fullMonth ++;

        }else{

            fullData.month[month].data.time += element.time;
        }

         // yearly
         if(!fullData.year[year]){

            fullData.year[year] = {

                data: {
                    "date": year,
                    "time": element.time,
                },
            };

            // full day
            status.fullYear ++;

        }else{

            fullData.year[year].data.time += element.time;
        }

        // total hours
        status.fullTime += element.time;

        // technology
        if(!fullData.tech[element.tech]){

            fullData.tech[element.tech] = {

                data: {
                    "tech": element.tech,
                    "time": element.time,
                }
            };

            // full technology
            status.fullTech.push(element.tech);

        }else{

            fullData.tech[element.tech].data.time += element.time;
        }

        // Project
        if(!fullData.proj[element.project]){

            fullData.proj[element.project] = {

                data: {
                    "date": element.project,
                    "time": element.time,
                },
                tech:{},
            };

            // full proj
            status.fullProj.push(element.project);

        }else{

            fullData.proj[element.project].data.time += element.time;
        }

        // technology per Project
        if (!fullData.proj[element.project].tech[element.tech]) {

            fullData.proj[element.project].tech[element.tech] = {

                "tech": element.tech,
                "time": element.time,
                "date": day,
            };

        } else {

            fullData.proj[element.project].tech[element.tech].time += element.time;
        }

        // project per day
        if (!fullData.day[day].proj[element.project]) {

            fullData.day[day].proj[element.project] = {

                "proj": element.project,
                "time": element.time,
                "date": day,
            };

        } else {

            fullData.day[day].proj[element.project].time += element.time;
        }

            // technology per day
            if (!fullData.day[day].tech[element.tech]) {

                fullData.day[day].tech[element.tech] = {

                    "tech": element.tech,
                    "time": element.time,
                    "date": day,
                };

            } else {

                fullData.day[day].tech[element.tech].time += element.time;
            }
        });

    // STATUS //
    // version
    document.getElementById('version').innerHTML = "Sublime V." + sttsObject[0].version;

    // arch
    document.getElementById('arch').innerHTML = sttsObject[0].arch + " Archteture";

    // platform
    document.getElementById('platform').innerHTML = sttsObject[0].platform + " Platform";

    // total de horas
    document.getElementById('fullTime').innerHTML = (status.fullTime / 3600).toFixed(2) + " Hours";

    // total de dias
    document.getElementById('fullDay').innerHTML = status.fullDay + "  Days";

    // total de meses
    document.getElementById('fullMonth').innerHTML = status.fullMonth + "  Months";

     // total de anos
     document.getElementById('fullYear').innerHTML = status.fullYear + "  Years";

    // total de projetos
    document.getElementById('fullProj').innerHTML = status.fullProj.length + "  Projects";

    // total de tecnologias
    document.getElementById('fullTech').innerHTML = status.fullTech.length + " Technolgies";

    // DAY X PROJECT GRAPHIC //
    let dayGraph = {

        legend:{data:['Total Hours'],x:'left'},
        tooltip:{trigger:'axis'},
        calculable: true,
        xAxis:[{name:'[Day]', type:'category', boundaryGap:true, data:[]}],
        yAxis:[{type:'value',axisLabel:{formatter:'{value} hrs'}}],
        series:[{name:'Total Hours',type:'line',data:[]}],
    }

    // count the days
    let tempLimitDay = Object.keys(fullData.day).length;

    // adjust data for make the graphic
    Object.keys(fullData.day).forEach(function(e, i) {

        if (i > tempLimitDay - 2 - 1) {

        // insert the date
        dayGraph.xAxis[0].data.push(fullData.day[e].data.date);

        // insert the time
        dayGraph.series[0].data.push((fullData.day[e].data.time / 3600).toFixed(2));

        // projects per day
        let s = fullData.day[e].proj;

        // make the graphic of projects per day
        Object.keys(s).forEach(function(e, i) {

            let tt = findValue(dayGraph.series, "name", e);

            if (!tt) {

              dayGraph.series.push({name: e, data:[ (s[e].time /3600).toFixed(2) ], type: 'bar'} );

          } else {

              dayGraph.series[tt].data.push((s[e].time /3600).toFixed(2));
          }
      });

    // insert zero
    status.fullProj.forEach(function(e, i) {

        let tt = findValue(dayGraph.series, "name", e);

        if (tt) {

            if(dayGraph.series[tt].data.length < dayGraph.xAxis[0].data.length) {

                dayGraph.series[tt].data.push(0);
            }
        } else {

            dayGraph.series.push({name: e, data:[0], type: 'bar'} );
        }
    });

}
});

    // make the legend
    status.fullProj.forEach(function(e, i) {

        dayGraph.legend.data.push(e);
    });

    // show the graphic
    var myChart = echarts.init(document.getElementById('dayGraph'));
    myChart.setOption(dayGraph);

    // DAY X TECHNOLOGY GRAPHIC //
    let dayTechGraph = {
        legend:{data:['Total Hours'],x:'left'},
        tooltip:{trigger:'axis'},
        calculable: true,
        xAxis:[{name:'[Day]', type:'category', boundaryGap:true, data:[]}],
        yAxis:[{type:'value',axisLabel:{formatter:'{value} hrs'}}],
        series:[{name:'Total Hours',type:'bar',data:[]}],
    }

    // ajusta os dados para o gráfico (day)
    Object.keys(fullData.day).forEach(function(e, i) {

        // insere os dias
        dayTechGraph.xAxis[0].data.push(fullData.day[e].data.date);

        // insere as horas
        dayTechGraph.series[0].data.push((fullData.day[e].data.time / 3600).toFixed(2));

        // Insere projetos no gráfico de dia.
        let s = fullData.day[e].tech; // igual a um dia.

        // monta o gráfico de projetos por dia
        Object.keys(s).forEach(function(e, i) {

            let tt = findValue(dayTechGraph.series, "name", e);

            if (!tt) {

              dayTechGraph.series.push({name: e, data:[ (s[e].time /3600).toFixed(2) ], type: 'bar'} );

          } else {

              dayTechGraph.series[tt].data.push((s[e].time /3600).toFixed(2));
          }
      });

    // insere zero
    status.fullTech.forEach(function(e, i) {

        let tt = findValue(dayTechGraph.series, "name", e);

        if (tt) {

            if(dayTechGraph.series[tt].data.length < dayTechGraph.xAxis[0].data.length) {

                dayTechGraph.series[tt].data.push(0);
            }
        } else {

            dayTechGraph.series.push({name: e, data:[0], type: 'bar'} );
        }
    });
});

    // make the legend of day graphic
    status.fullTech.forEach(function(e, i) {

        dayTechGraph.legend.data.push(e);
    });

    // apresenta o gráfico na view
    var myChart = echarts.init(document.getElementById('dayTechGraph'));
    myChart.setOption(dayTechGraph);

    // =========================================================================================== //
    // ### config TECHNOLOGY X Project GRAPHIC ### //
    let projTechGraph = {
        // title:{subtext:'Hours by Day and Technology by Day', x:'right'},
        legend:{data:['Total Hours'],x:'left'},
        tooltip:{trigger:'axis'},
        calculable: true,
        xAxis:[{name:'[Project]', type:'category', boundaryGap:true, data:[]}],
        yAxis:[{type:'value',axisLabel:{formatter:'{value} hrs'}}],
        series:[{name:'Total Hours',type:'bar',data:[]}],
    }

    // ajusta os dados para o gráfico (day)
    Object.keys(fullData.proj).forEach(function(e, i) {

        // insere os dias
        projTechGraph.xAxis[0].data.push(fullData.proj[e].data.date);

        // insere as horas
        projTechGraph.series[0].data.push((fullData.proj[e].data.time / 3600).toFixed(2));

        // Insere projetos no gráfico de dia.
        let s = fullData.proj[e].tech; // igual um projeto

        // monta o gráfico de projetos por dia
        Object.keys(s).forEach(function(e, i) {

            let tt = findValue(projTechGraph.series, "name", e);

            if (!tt) {

              projTechGraph.series.push({name: e, data:[ (s[e].time /3600).toFixed(2) ], type: 'bar'} );

          } else {

              projTechGraph.series[tt].data.push((s[e].time /3600).toFixed(2));
          }
      });

    // insere zero
    status.fullTech.forEach(function(e, i) {

        let tt = findValue(projTechGraph.series, "name", e);

        if (tt) {

            if(projTechGraph.series[tt].data.length < projTechGraph.xAxis[0].data.length) {

                projTechGraph.series[tt].data.push(0);
            }
        } else {

            projTechGraph.series.push({name: e, data:[0], type: 'bar'} );
        }
    });
});

    // make the legend of day graphic
    status.fullTech.forEach(function(e, i) {

        projTechGraph.legend.data.push(e);
    });

    // apresenta o gráfico na view
    var myChart = echarts.init(document.getElementById('projTechGraph'));
    myChart.setOption(projTechGraph);

    // ### config PROJECT GRAPHIC ### //
    let projGraph = {
        title:{x:'center'},
        legend:{orient:'horizontal',data:[],x:'left'},
        tooltip:{trigger:'item',formatter:"{a} <br/>{b} : {c} ({d}%)"},
        calculable: true,
        series:[{name:'Total Hours',type:'pie',radius:'55%',center:['50%','60%'],roseType:'area',data:[]}],
    }

        // ajusta os dados para o gráfico de linha
        Object.keys(fullData.proj).forEach(function(e, i) {

            projGraph.series[0].data.push({value:(fullData.proj[e].data.time / 3600).toFixed(2), name:e});
            projGraph.legend.data.push(e);
        });

        // apresenta o gráfico na view
        var myChart = echarts.init(document.getElementById('projGraph'));
        myChart.setOption(projGraph);

        // ### Config TECHNOLOGY GRAPHIC ### //
        let techGraph = {
          title:{x:'center'},
          legend:{orient:'horizontal',data:[],x:'left'},
          tooltip:{trigger:'item',formatter:"{a} <br/>{b} : {c} ({d}%)"},
          calculable: true,
          series:[{name:'Total Hours',type:'pie',radius:'55%',center:['50%','60%'],roseType:'area',data:[]}],
      }

        // ajusta os dados para o gráfico
        Object.keys(fullData.tech).forEach(function(e, i) {

            techGraph.series[0].data.push({value:(fullData.tech[e].data.time / 3600).toFixed(2), name:e});
            techGraph.legend.data.push(e);
        });

        // apresenta o gráfico na view
        var myChart = echarts.init(document.getElementById('techGraph'));
        myChart.setOption(techGraph);

    // ### config MONTH GRAPHIC ### //
    let monthGraph = {
        title:{subtext:'Total hours worked in month', x:'center'},
        legend:{data:[],x:'left'},
        tooltip:{trigger:'axis'},
        calculable: true,
        xAxis:[{name:'[Month]', type:'category', boundaryGap:true, data:[]}],
        yAxis:[{type:'value',axisLabel:{formatter:'{value} hrs'}}],
        series:[{name:'Worked Hours',type:'line',data:[]}],
    }

    // ajusta os dados para o gráfico de linha
    Object.keys(fullData.month).forEach(function(element, index) {
        // insere os dias
        monthGraph.xAxis[0].data.push(fullData.month[element].data.date);
        // insere as horas
        monthGraph.series[0].data.push((fullData.month[element].data.time / 3600).toFixed(2));
    });

    // apresenta o gráfico na view
    var myChart = echarts.init(document.getElementById('monthGraph'));
    myChart.setOption(monthGraph);

    // ### config YEAR GRAPHIC ### //
    let yearGraph = {
        title:{subtext:'Total hours worked in year', x:'center'},
        legend:{data:[],x:'left'},
        tooltip:{trigger:'axis'},
        calculable: true,
        xAxis:[{name:'[Year]', type:'category', boundaryGap:true, data:[]}],
        yAxis:[{type:'value',axisLabel:{formatter:'{value} hrs'}}],
        series:[{name:'Worked Hours',type:'bar',data:[]}],
    }

    // ajusta os dados para o gráfico de linha
    Object.keys(fullData.year).forEach(function(element, index) {
        // insere os dias
        yearGraph.xAxis[0].data.push(fullData.year[element].data.date);
        // insere as horas
        yearGraph.series[0].data.push((fullData.year[element].data.time / 3600).toFixed(2));
    });

    // apresenta o gráfico na view
    var myChart = echarts.init(document.getElementById('yearGraph'));
    myChart.setOption(yearGraph);

});

    /**
     * { function for verify if exists some data in array of objects }
     *
     * @param      {<array>}  arraySearch  The array search
     * @param      {<str>}  key        The key
     * @param      {<str>}  value      The value
     * @return     {int or null}  { if true return is id of array, if false return null }
     */
     function findValue(arraySearch, key, value) {

        for (let i = 0; i < arraySearch.length; i++) {

            if (arraySearch[i][key] == value) {
                return i;
            }
        }
        return null;
    }

    /**
     * { function for show or hidden the title }
     */
     $(window).scroll(function(){

      let top = $(window).scrollTop();

      if(top > 60){

        $('#subMenu').stop().fadeIn(100);
        $('.navbar-fixed-top').css('padding-top', 0);

      }else{

        $('#subMenu').stop().fadeOut(0);
        $('.navbar-fixed-top').css('padding-top', '75px');
    }
});


     // call the refresh (ms)
     window.setInterval(refresh, 180000);


     /**
      * { function for refresh the page }
      */
      function refresh() {
       location.reload();
   }

     /**
      * { function to do collpase}
      */
      $(function () {
         $('[data-tooltip="tooltip"]').tooltip()
     })
