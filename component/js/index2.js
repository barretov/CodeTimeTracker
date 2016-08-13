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

    // transforma txto em objeto
    var sttsObject = [];
    let sttsTemp = stts.split('stts');

    for(let i = 1; i < sttsTemp.length; i++) {

     sttsObject.push(JSON.parse(sttsTemp[i]));
 }

    // transforma txto em objeto
    var dataObject = [];
    let dataTemp = data.split('data');

    for(let i = 1; i < dataTemp.length; i++) {

     dataObject.push(JSON.parse(dataTemp[i]));
 }

    // faz os acumuladores
    var fullData = {};
    fullData.month ={};
    fullData.day ={};
    fullData.tech ={};
    fullData.proj ={};

    var status = {};
    status.fullTime = 0;
    status.fullMonth = 0;
    status.fullDay = 0;
    status.fullTech = 0;
    status.fullProj = 0;

    // percorre todos os dados.
    dataObject.forEach(function(element, index) {

        // adjust data
        let date = new Date(element.date * 1000);
        let day = [date.getDate(), date.getMonth(), date.getFullYear()].join('-');
        let month = [date.getMonth(), date.getFullYear()].join('-');
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
            status.fullProj ++;

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
    document.getElementById('fullProj').innerHTML = status.fullProj + "  Projects";

    // total de tecnologias
    document.getElementById('fullTech').innerHTML = status.fullTech + " Technolgies";

    // Config of Day Graph
    var dayGraph ={

       title: {
        // text: 'Horas Mensais',
        subtext: 'Hours by Day',
        x: 'center'
    },

    legend: {
        data:['Total Hours', 'a']
    },

    tooltip : {

        trigger: 'axis'
    },

    calculable : true,

    xAxis : [

    {
        name: '[Day]',
        type : 'category',
        boundaryGap : true,
        data : []
    }
    ],

    yAxis : [
    {
        name: '[Hours]',
        type : 'value'
    }
    ],

    series : [
    {
        name: 'Total Hours',
        type: 'line',
        data: []

    },
    {
        name: 'a',
        type: 'line',
        data: ['12312', 313123, 0]

    },

    ]
};


var all = {};
all.all = fullData;

Object.keys(all).forEach(function(e, i) {

        // DAY
        Object.keys(all[e].day).forEach(function(de, di){

                    // TODO remove //
                    // console.log(all[e].day[de].data.time);
                            // TODO remove //

                    // insere os dias
                    // console.log(dayGraph.xAxis[di]);
                    // console.log(all[e].day[de].data.date);
                     dayGraph.xAxis[di].data.push(all[e].day[de].data.date);
                    dayGraph.series[di].data.push((all[e].day[de].data.time / 3600).toFixed(2));

                });

    });



let tempProject = {};
    // ajusta os dados para o gráfico (day)
    Object.keys(fullData.day).forEach(function(element, index) {

        // insere os dias
        // dayGraph.xAxis[0].data.push(fullData.day[element].data.date);

        // insere as horas
        // dayGraph.series[0].data.push((fullData.day[element].data.time / 3600).toFixed(2));

      // let s = fullData.day[element].proj; // igual a um dia.


      // laço de projetos
      Object.keys(s).forEach(function(ele, ind) {

        if(s[ele].date === fullData.day[element].data.date) {

            if (!tempProject[ele]) {
                // console.log("bb");

                // dayGraph.series[++ind]= {name: ele, data:[ (s[ele].time /3600).toFixed(2) ], type: 'bar'};
                // dayGraph.legend.data.push(ele);
                // TODO remove //
                // dayGraph.series.push({name: ele, data:[ (s[ele].time /3600).toFixed(2) ], type: 'bar'});
                // dayGraph.series[++ind].data.push((s[ele].time /3600).toFixed(2));
                // dayGraph.series[++ind].push({name: ele, data:[ (s[ele].time /3600).toFixed(2) ], type: 'bar'});
                // tempProject[ele] = {id:ind};

            } else {

                // console.log("cc");
                // dayGraph.series[++ind].data.push((s[ele].time /3600).toFixed(2));

            }
            // TODO remove //
            // console.log(tempProject);
            // TODO remove //
            // console.log(dayGraph.series);
            // TODO remove //
            // console.log(s[ele]);
            // console.log(s[ele].proj);

            // console.log(fullData.day[element]);

                // if (!dayGraph.legend.data[ele]){

                    // dayGraph.legend.data.push(ele);
                // }

                //
                // TODO remove //
                // console.log(dayGraph.series);
                // console.log(dayGraph.series);
                // TODO remove //
                // console.log(s[ele]);
            }
                // TODO remove //
                // console.log(ele);
                // TODO remove //
                // console.log(fullData);

                // legend
            });
  });


    // apresenta o gráfico na view
    var myChart = echarts.init(document.getElementById('dayGraph'));
    myChart.setOption(dayGraph);

});