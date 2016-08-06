document.addEventListener('DOMContentLoaded', function(e){

    var data = '';

    var req = new XMLHttpRequest();
    req.open('get', 'data.txt', false);

    req.onload = function(e){
        data = e.target.response;
    }

    req.onerror = function(e){
        console.log(e);
    }

    req.send();

    // transforma txto em objeto
    var dataObject = [];
    var teste = data.split('data');

    for(let i = 1; i < teste.length; i++) {

       dataObject.push(JSON.parse(teste[i]));
   }

    // faz os acumuladores
    var bolas = {};

    dataObject.forEach(function(element, index) {

        let date = new Date(element.date * 1000);
        // let key = [date.getDate(), date.getMonth(), date.getFullYear()].join('-');
        let key = [date.getMonth(), date.getFullYear()].join('-');
        let tech = element.tech;

        // data
        if(!bolas[key]){

            bolas[key] = {

                day: {
                    "date": key,
                    "time": element.time,
                }
            };

        }else{

            bolas[key].day.time += element.time;
        }

    });

    // Config of Graphic Line
    var graphLine ={

         title: {
            text: 'Horas Mensais',
            // subtext: 'Mensal',
            x: 'center'
        },

        tooltip : {

            trigger: 'axis'
        },

        calculable : true,

        xAxis : [

        {
            // name : 'Mês',
            type : 'category',
            boundaryGap : true,
            data : []
        }
        ],

        yAxis : [
        {
            name: 'Horas',
            type : 'value'
        }
        ],

        series : [

        {
            name:'Horas Trabalhadas',
            type:'line',
            data:[]
        },

        ]
    };

    // ajusta os dados para o gráfico de linha
    Object.keys(bolas).forEach(function(element, index) {

        // insere os dias
        graphLine.xAxis[0].data.push(bolas[element].day.date);

        // insere as horas
        graphLine.series[0].data.push(bolas[element].day.time / 3600);
    });

    // apresenta o gráfico na view
    var myChart = echarts.init(document.getElementById('graphLine'));
    myChart.setOption(graphLine);

    // TODO remove //
    // console.log(data);


});