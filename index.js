document.addEventListener('DOMContentLoaded', function(e){

    var data = '';

    var req = new XMLHttpRequest();
    req.open('get', '../User/tracker_time/data.txt', false);

    req.onload = function(e){
        data = e.target.response;
        // TODO remove //
        console.log(data);
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
        let key = [date.getDate(), date.getMonth(), date.getFullYear()].join('-');
        let tech = element.tech;

        // data
        if(!bolas[key]){

            bolas[key] = {

                day: {
                    "date": element.date,
                    "time": element.time,
                }
            };

            // if (!bolas[key][tech]) {

            //     bolas[key].tech ={

            //         [tech]: {
            //             "time" : element.time,
            //         },
            //     };
            // }


        }else{

            bolas[key].day.time += element.time;

            // if(bolas[key][tech]){

            //     bolas[key][tech][element.tech].time += element.time;

            // }
        }

    });

    var graphLine ={

        tooltip : {

            trigger: 'axis'
        },

        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },

        calculable : true,

        xAxis : [

        {
            type : 'category',
            boundaryGap : true,
            data : ['12','13','14','15','16']
        }
        ],
        yAxis : [
        {
            type : 'value'
        }
        ],

        series : [

        {
            name:'teste',
            type:'line',
            stack: 'aaaa',
            data:[120, 132, 101, 134, 90, 230, 210]
        },

        ]
    };


    Object.keys(bolas).forEach(function(element, index) {

                // TODO remove //
                // console.log(bolas[element].day);

                graphLine.xAxis[0].data.push(bolas[element].day.date);
                graphLine.series[0].data.push(bolas[element].day.time);

            });

    // console.log(data);
    //         // TODO remove //
            // console.log(bolas);

    // console.log(graphLine.xAxis[0].data);
    // console.log(graphLine);

});