    console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
    console.log("┃     SublimeTime-tracker 1.0      ┃");
    console.log("┠──────────────────────────────────┨");
    console.log("┃          victorio.tk             ┃");
    console.log("┃ victor.eduardo.barreto@gmail.com ┃");
    console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");

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
                tech: {

                }
            };

                        // technology per day
                        if(!fullData.day[day].tech[element.tech]){

                            fullData.day[day].tech[element.tech] = {

                                "tech": element.tech,
                                "time": element.time,
                            };

                        }

            // full day
            status.fullDay ++;

        }else{

            fullData.day[day].data.time += element.time;

               // technology per day
               if(!fullData.day[day].tech[element.tech]){

                 fullData.day[day].tech[element.tech] = {

                     "tech": element.tech,
                     "time": element.time,
                 };

             } else {

                fullData.day[day].tech[element.tech].time += element.time;
            }
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

    // Config of Tech Graph
    var techGraph ={

       title: {
        // text: 'Horas Tecnologia',
        subtext: 'Hours by Technology',
        x: 'center'
    },

    tooltip : {

        trigger: 'axis'
    },

    calculable : true,

    xAxis : [

    {
        name : '[Technology]',
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
        name:'Worked Hours',
        type:'bar',
        data:[]
    },

    ]
};

    // ajusta os dados para o gráfico
    Object.keys(fullData.tech).forEach(function(element, index) {

        // insere os dias
        techGraph.xAxis[0].data.push(fullData.tech[element].data.tech);

        // insere as horas
        techGraph.series[0].data.push((fullData.tech[element].data.time / 3600).toFixed(2));
    });

    // apresenta o gráfico na view
    var myChart = echarts.init(document.getElementById('techGraph'));
    myChart.setOption(techGraph);

    // Config of Day Graph
    var dayGraph ={

       title: {
        // text: 'Horas Mensais',
        subtext: 'Hours by Day',
        x: 'center'
    },

    legend: {
        data:['Total Hours', 'txt']
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
        name:'Total Hours',
        type:'line',
        data:[],
    },

    ]
};


// ######## TESTANDO #############
var fullObj = fullData;

Object.keys(fullData).forEach( function(element, index) {
    // statements
    //         // TODO remove //
            console.log(fullObj);

});
// ######## TESTANDO #############

var s;
    // ajusta os dados para o gráfico (day)
    Object.keys(fullData.day).forEach(function(element, index) {

        // insere os dias
        dayGraph.xAxis[0].data.push(fullData.day[element].data.date);

        // insere as horas
        dayGraph.series[0].data.push((fullData.day[element].data.time / 3600).toFixed(2));


       s = fullData.day[element].tech; // igual a um dia.

            // Fazer um series para cada tecnologia
            // percorre as tecnologias do dia.
                let lgDayG = {};
            Object.keys(s).forEach(function(key, ind) {

                let a = s[key].tech;

                if (!lgDayG[a]) {

                    dayGraph.legend.data.push(a);
                }

            dayGraph.series[++ind] = {name: s[key].tech, data:[], type: 'bar'};
            dayGraph.series[ind].data.push((s[key].time /3600).toFixed(2));
        });
        });

    // apresenta o gráfico na view
    var myChart = echarts.init(document.getElementById('dayGraph'));
    myChart.setOption(dayGraph);

    // Config of Month Graph
    var monthGraph ={

       title: {
        // text: 'Horas Mensais',
        subtext: 'Hours by Month',
        x: 'center'
    },

    tooltip : {

        trigger: 'axis'
    },

    calculable : true,

    xAxis : [

    {
        name : '[Month]',
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
        name:'Worked Hours',
        type:'line',
        data:[]
    },

    ]
};

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


        // ### Config of Proj Graph ### //
        var projGraph ={

           title: {
            // text: 'Horas Mensais',
            subtext: 'Hours by Projects',
            x: 'center'
        },

        tooltip : {

            trigger: 'axis'
        },

        calculable : true,

        xAxis : [

        {
            name : '[Project]',
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
            name:'Worked Hours',
            type:'line',
            data:[]
        },

        ]
    };

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