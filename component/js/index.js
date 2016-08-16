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

    // transforma txto em objeto para formar o STATUS
    let sttsObject = [];
    let sttsTemp = stts.split('stts');

    for(let i = 1; i < sttsTemp.length; i++) {

     sttsObject.push(JSON.parse(sttsTemp[i]));
 }

    // transforma txto em objeto para os DADOS
    let dataObject = [];
    let dataTemp = data.split('data');

    for(let i = 1; i < dataTemp.length; i++) {

     dataObject.push(JSON.parse(dataTemp[i]));
 }

    // faz os acumuladores de dados.
    let fullData = {};
    fullData.month ={};
    fullData.day ={};
    fullData.tech ={};
    fullData.proj ={};

    // Acumuladores de status.
    let status = {};
    status.fullTime = 0;
    status.fullMonth = 0;
    status.fullDay = 0;
    status.fullTech = 0;
    status.fullProj = [];

    // percorre todos os dados.
    dataObject.forEach(function(element, index) {

        let fullDate = element.date.split(" ");
        let date = fullDate[0];
        let hour = fullDate[1];
        let month = date.slice(0,7);
        let day = date.slice(5);

        ('' == element.tech)? element.tech = "unknown": '';
        ('none' == element.project)? element.project = "off project": '';

        // diário
        if(!fullData.day[day]){

            fullData.day[day] = {

                data: {
                    "date": day,
                    "time": element.time,
                },
                proj: {},
            };

            // full day
            status.fullDay ++;

        }else{

            fullData.day[day].data.time += element.time;
        }

        // mensal
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

        // total de horas
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
            status.fullTech ++;

        }else{

            fullData.tech[element.tech].data.time += element.time;
        }

        // Project
        if(!fullData.proj[element.project]){

            fullData.proj[element.project] = {

                data: {
                    "date": element.project,
                    "time": element.time,
                }
            };

            // full proj
            status.fullProj.push(element.project);

        }else{

            fullData.proj[element.project].data.time += element.time;
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

    });

    // ### Status ### //
    // version
    document.getElementById('version').innerHTML = "Sublime V." + sttsObject[0].version;

    // arch
    document.getElementById('arch').innerHTML = sttsObject[0].arch + " Archteture";

    // platform
    document.getElementById('platform').innerHTML = sttsObject[0].platform + " Platform";

    // total de horas
    document.getElementById('fullTime').innerHTML = (status.fullTime / 3600).toFixed(2) + " Hours";

    // total de meses
    document.getElementById('fullMonth').innerHTML = status.fullMonth + "  Months";

    // total de dias
    document.getElementById('fullDay').innerHTML = status.fullDay + "  Days";

    // total de projetos
    document.getElementById('fullProj').innerHTML = status.fullProj.length + "  Projects";

    // total de tecnologias
    document.getElementById('fullTech').innerHTML = status.fullTech + " Technolgies";

    // ### Config TECHNOLOGY GRAPHIC ### //
    let techGraph = {
        title:{text:'',subtext:'Hours by Technology',x:'center'},
        legend:{data:['Total Hours']},
        tooltip:{trigger:'axis'},
        calculable: true,
        xAxis:[{name:'[Technology]', type:'category', boundaryGap:true, data:[]}],
        yAxis:[{name:'[Hours]', type:'value'}],
        series:[{name:'Workerd Hours',type:'bar',data:[]}],
    }

    // ajusta os dados para o gráfico
    Object.keys(fullData.tech).forEach(function(e, i) {

        // insere os dias
        techGraph.xAxis[0].data.push(fullData.tech[e].data.tech);

        // insere as horas
        techGraph.series[0].data.push((fullData.tech[e].data.time / 3600).toFixed(2));
    });

    // apresenta o gráfico na view
    var myChart = echarts.init(document.getElementById('techGraph'));
    myChart.setOption(techGraph);

    // ### config DAY GRAPHIC ### //
    let dayGraph = {
        title:{subtext:'Hours by Day and Projects by Day', x:'center'},
        legend:{data:['Total Hours']},
        tooltip:{trigger:'axis'},
        calculable: true,
        xAxis:[{name:'[Day]', type:'category', boundaryGap:true, data:[]}],
        yAxis:[{name:'[Hours]', type:'value'}],
        series:[{name:'Total Hours',type:'line',data:[]}],
    }

    // ajusta os dados para o gráfico (day)
    Object.keys(fullData.day).forEach(function(e, i) {

        // insere os dias
        dayGraph.xAxis[0].data.push(fullData.day[e].data.date);

        // insere as horas
        dayGraph.series[0].data.push((fullData.day[e].data.time / 3600).toFixed(2));

        // Insere projetos no gráfico de dia.
        let s = fullData.day[e].proj; // igual a um dia.

        // monta o gráfico de projetos por dia
        Object.keys(s).forEach(function(e, i) {

            let tt = findValue(dayGraph.series, "name", e);

            if (!tt) {

              dayGraph.series.push({name: e, data:[ (s[e].time /3600).toFixed(2) ], type: 'bar'} );

          } else {

              dayGraph.series[tt].data.push((s[e].time /3600).toFixed(2));
          }
      });

    // insere zero
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
});

    // make the legend of day graphic
    status.fullProj.forEach(function(e, i) {

        dayGraph.legend.data.push(e);
    });

    // apresenta o gráfico na view
    var myChart = echarts.init(document.getElementById('dayGraph'));
    myChart.setOption(dayGraph);

    // ### config MONTH GRAPHIC ### //
    let monthGraph = {
        title:{subtext:'Hours by Month', x:'center'},
        legend:{data:[]},
        tooltip:{trigger:'axis'},
        calculable: true,
        xAxis:[{name:'[Month]', type:'category', boundaryGap:true, data:[]}],
        yAxis:[{name:'[Hours]', type:'value'}],
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

    // ### config PROJECT GRAPHIC ### //
    let projGraph = {
        title:{subtext:'Hours by Projects', x:'center'},
        legend:{data:[]},
        tooltip:{trigger:'axis'},
        calculable: true,
        xAxis:[{name:'[Project]', type:'category', boundaryGap:true, data:[]}],
        yAxis:[{name:'[Hours]', type:'value'}],
        series:[{name:'Worked Hours',type:'line',data:[]}],
    }

        // ajusta os dados para o gráfico de linha
        Object.keys(fullData.proj).forEach(function(element, index) {

            // insere os dias
            projGraph.xAxis[0].data.push(fullData.proj[element].data.date);

            // insere as horas
            projGraph.series[0].data.push((fullData.proj[element].data.time / 3600).toFixed(2));
        });

        // apresenta o gráfico na view
        var myChart = echarts.init(document.getElementById('projGraph'));
        myChart.setOption(projGraph);

    });


    /**
     * { function for verify if exists some data in array of objects }
     *
     * @param      {<array>}  arraySearch  The array search
     * @param      {<str>}  key        The key
     * @param      {<str>}  value      The value
     * @return     {int or null}  { if true ruturn is id of array, if false return null }
     */
     function findValue(arraySearch, key, value) {

        for (var i = 0; i < arraySearch.length; i++) {

            if (arraySearch[i][key] == value) {
                return i;
            }
        }
        return null;
    }