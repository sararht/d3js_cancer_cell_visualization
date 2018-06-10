
d3.json("static/data/data_corr.json", function(error, graphData) {
    
lista=[]
lista=['radius_mean','texture_mean','perimeter_mean','area_mean',
      'smoothness_mean','compactness_mean','concavity_mean',
      'concave points_mean','symmetry_mean','fractal_dimension_mean','radius_se','texture_se','perimeter_se','area_se',
      'smoothness_se','compactness_se','concavity_se',
      'concave points_se','symmetry_se','fractal_dimension_se',
      'radius_worst','texture_worst','perimeter_worst','area_worst',
      'smoothness_worst','compactness_worst','concavity_worst',
      'concave points_worst','symmetry_worst','fractal_dimension_worst'];


// Lista ordenada
lista_ordenada=lista.sort();
lista_nombre=[]
for (var i = 0; i < 30; i++) {
    lista_nombre[lista_ordenada[i]]=i
}


lista=['radius_mean','texture_mean','perimeter_mean','area_mean',
      'smoothness_mean','compactness_mean','concavity_mean',
      'concave points_mean','symmetry_mean','fractal_dimension_mean','radius_se','texture_se','perimeter_se','area_se',
      'smoothness_se','compactness_se','concavity_se',
      'concave points_se','symmetry_se','fractal_dimension_se',
      'radius_worst','texture_worst','perimeter_worst','area_worst',
      'smoothness_worst','compactness_worst','concavity_worst',
      'concave points_worst','symmetry_worst','fractal_dimension_worst'];

lista_defecto=[]
for (var i = 0; i < 30; i++) {
    lista_defecto[lista[i]]=i
}

var data = [];
for (var i = 0; i < 30; i++) {
    for (var j = 0; j < 30; j++) {

        data.push( {car1:lista[i],car2:lista[j], value:graphData[lista[i]][lista[j]], posX:i, posY:j, posX_nombre: lista_nombre[lista[i]], posY_nombre: lista_nombre[lista[j]]} ); 
    }
}



var numrows = data.length;
var numcols = numrows;



var selectValue="Defecto"


//["rgba(64, 76, 87, 0.99)","rgba(86, 78, 103, 0.99)","rgba(129, 98, 137, 0.99)","rgba(170, 119, 170, 0.99)","rgba(212, 140, 203, 0.99)","#FEA1EB"].reverse(),
var margin = {top: 0, right: 150, bottom: 50, left: 160},
        width = 800, 
        height = 800,
        colors = ['#f7fcfd','#e0ecf4','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d','#810f7c','#4d004b'],
        caracteristicas = lista,
        caracteristicas_nombre = lista_nombre,
        gridSize = Math.floor(width / 40),
        legentElementHeight = gridSize*3,    
        buckets = 9;   
      
var svg = d3.select("#chart")
        .append("svg")
        .attr("width", 1000 + margin.left + margin.right)
        .attr("height", 1000 + margin.top + margin.bottom)

var svg = d3.select("svg")
        .attr("class", "MatrizCorrelacion")
        .append("g")
        .attr("width", 1500 + margin.left + margin.right)
        .attr("height", 1500 + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


///////////////////////////// LEYENDA EJES  /////////////////////////////////////////
 var car1Labels = svg.selectAll(".car1Label")
          .data(caracteristicas)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 25)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-10," + gridSize / 1.5 + ")")
            .attr("class", "car1Label")
            .attr('id', function(d,i) {return "car1Label" + i})

var svg = d3.select("svg")
        .append('g')
        .attr("width", 500 + margin.left + margin.right)
        .attr("height", 500 + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var car2Labels = svg.selectAll(".car2Label")
          .data(caracteristicas)
          .enter().append("text")
            .attr("class", "car2Label")
            .attr('id', function(d,i) {return "car2Label" + i})
            .text(function(d) { return d; })
            .attr('x',0)
            .attr('y',0)
            .style("text-anchor", "middle")
            .attr('fill','black')
            .attr("transform", function(d, i) { return "translate("+i * gridSize + ","  + 34*gridSize + ") rotate(-60)" })
            
            
            


// Dominio escala de color
   var limites = d3.extent(data, function (d) { return d.value; });
   var step = (limites[1]-limites[0])/buckets;
   dominio = d3.range(limites[0],limites[1],step)

var colorScale = d3.scaleLinear()
        .domain(dominio)
        .range(colors);

var svg = d3.select("svg")
        .append("g")
        .attr("width", 500 + margin.left + margin.right)
        .attr("height", 500 + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var cards = svg.selectAll(".car1")
              .data(data)

cards.append("title");

///////////////////////////////// RECTÁNGULOS MATRIZ  //////////////////////////////////////////
cards.enter().append("rect")
  .attr("x", function(d,i){ return (d.posX * gridSize +25)})
  .attr("y", function(d,i){ return (d.posY * gridSize )})
  .attr("rx", 4)
  .attr("ry", 4)
  .attr("class", "RectCorrelacion")
  .attr("width", gridSize)
  .attr("height", gridSize)
  .style("fill", function(d){return colorScale (d.value)})
  .on("mouseover", function(d,i)
  {


    d3.select(this)
      .attr("stroke","black" )
      .attr("stroke-width", 2);

    d3.select(".tooltiprect")
      .datum(d)
      .attr('x',function(d)
      {
        if (selectValue=='Defecto')
            return (d.posX+1) * gridSize ;


        else if (selectValue=='Nombre')
            return (d.posX_nombre+1) * gridSize ;
      })
      .attr('y',function(d){
        if (selectValue=='Defecto')
          return (d.posY+1.2) * gridSize ; 


        else if (selectValue=='Nombre')
          return (d.posY_nombre+1.2) * gridSize ; 

      })
      .attr('visibility', 'visible')
    
     d3.select('.tooltiptext')
      .datum(d)
      .attr('x',function(d)
        {
          if (selectValue=='Defecto')
            return (d.posX+1.25) * gridSize ;

        else if (selectValue=='Nombre')
            return (d.posX_nombre+1.25) * gridSize ;
        })

      .attr('y',function(d){
        if (selectValue=='Defecto')
          return (d.posY+2) * gridSize ; 

        else if (selectValue=='Nombre')
          return (d.posY_nombre+2) * gridSize ; 
      })

      .attr('visibility', 'visible')
      .text((function(d){return d.value.toFixed(3) }))


    if (selectValue=='Defecto') 
    {
      var textRow=d3.select(this).attr('x')-25
      var textCol=d3.select(this).attr('y')
      d3.select('#car1Label'+(textCol/gridSize).toFixed(0))
        .attr('fill','Violet')
        .style('font-weight','bold')

      d3.select('#car2Label'+(textRow/gridSize).toFixed(0))
        .attr('fill','Violet')
        .style('font-weight','bold')
      }

    else if (selectValue=='Nombre')
    { 
      var textRow_aux=((d3.select(this).attr('x')-25)/gridSize).toFixed(0)
      var textCol_aux=((d3.select(this).attr('y'))/gridSize).toFixed(0)
      var textRow=lista_defecto[lista_ordenada[textRow_aux]]
      var textCol=lista_defecto[lista_ordenada[textCol_aux]]

      d3.select('#car1Label'+(textCol))
        .attr('fill','Violet')
        .style('font-weight','bold')

      d3.select('#car2Label'+(textRow))
        .attr('fill','Violet')
        .style('font-weight','bold')
        

    }
  })




  .on("mouseout", function(d,i)
  { // esto se ejecuta cuando pasamos el ratón por el punto
    
    d3.select(this)
      .attr("stroke","none")

    d3.select('.tooltiptext')
      .attr('visibility', 'hidden');

     d3.select('.tooltiprect')
      .attr('visibility', 'hidden');

    d3.selectAll(".car1Label")
        .attr('fill','black')
        .style('font-weight','normal')

     d3.selectAll(".car2Label")
        .attr('fill','black')
        .style('font-weight','normal')


  });



cards.select("title").text(function(d) { return d.value; });

cards.exit().remove();



///////////////////////////////// LEYENDA  //////////////////////////////////////////


var legend = svg.selectAll(".legend")
    .data(colors);

legend.enter().append('g')
    .attr("class","legend")
    .append("rect")
    .attr("x", 35*gridSize)
    .attr("y", function(d, i) { return legentElementHeight * i })
    .attr("width", gridSize*2)
    .attr("height", legentElementHeight)
    .style("fill", function(d, i) { return colors[i]; })

d3.selectAll(".legend")
    .data(dominio)
    .append("text")
    .text(function(d){return "≥ " + d.toFixed(3);})
    .attr("x", 38*gridSize)
    .attr("y", function(d, i) { return legentElementHeight * i +gridSize*1.6; });


legend.exit().remove();


///////////////////////////////// TOOLTIP //////////////////////////////////////////
   // Etiqueta con información de los puntos (tooltip)
    var etiqueta= svg.append('g')
          .attr('class','tooltip')

     etiqueta.append("rect")
          .attr('class', "tooltiprect")
          .attr('width', 2.5*gridSize)
          .attr('height', gridSize)
          .attr('fill', 'white')
          //.attr('opacity',0.9)
          .attr('visibility', 'hidden');

    etiqueta.append('text')
          .attr('class', 'tooltiptext')
          .attr('fill','black')
          .attr('visibility', 'hidden');

  


  // COMBO BOXES (SELECCIÓN)
    //////////////////////////////////////////////////////////////////////////////////////////////////
    // añadimos un objeto tipo "selección" (comboBox)
    var data22 = ["Defecto", "Nombre"];

    var select = d3.select('#ComboBoxes')
      .append('text')
      .text('Ordenar por: ')

    var select = d3.select('#ComboBoxes')
      .append('select')
        .attr('class','select')
        .on('change',onchange)

    var options = select
      .selectAll('option')
      .data(data22).enter()
      .append('option')
        .text(function (d) { return d; });


    function onchange() {
        selectValue = d3.select('select').property('value')
        if (selectValue=="Defecto"){
            ordenarDefecto()
          }

        else if (selectValue=="Nombre"){
            ordenarNombre()
          }
      
    };


    function ordenarNombre()
    {
          // redefinimos las posiciones

      d3.selectAll('.RectCorrelacion')
            .data(data)
            .transition()
            .duration(2500)
            .attr("x", function(d,i){ return (d.posX_nombre * gridSize +25)})
            .attr("y", function(d,i){ return (d.posY_nombre * gridSize)})

            

      d3.selectAll(".car1Label")
              .data(data)
              .transition()
              .duration(2500)
              .attr("x", 25)
              .attr("y", function (d, i) { return d.posY_nombre * gridSize; })


      
      d3.selectAll(".car2Label")
              .data(data)
              .transition()
              .duration(2500)
              .attr("transform", function(d,i) {return "translate("+d.posY_nombre * gridSize +","+34*gridSize+")rotate(-60)"})      
             
    }



   function ordenarDefecto()
    {
      d3.selectAll('.RectCorrelacion')
            .transition()
            .duration(2500)
            .attr("x", function(d,i){ return (d.posX * gridSize +25)})
            .attr("y", function(d,i){ return (d.posY * gridSize)})



      d3.selectAll(".car1Label")
              .data(data)
              .transition()
              .duration(2500)
              .attr("x", 25)
              .attr("y", function (d, i) { return d.posY * gridSize; })


      d3.selectAll(".car2Label")
          .data(caracteristicas)
            .transition()
            .duration(2500)
            //.attr('x',0)
            //.attr('y',0)
            .attr("transform", function(d, i) { return "translate("+i * gridSize + ","  + 34*gridSize + ") rotate(-60)" })

    }




});
