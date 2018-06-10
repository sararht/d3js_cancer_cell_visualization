data=[]

long=Object.keys(graphData[0]).length;
var data = [];
var data_targets =[]
for (var i = 0; i < long; i++) {
    data.push( {pcaX:graphData[0][i],pcaY:graphData[1][i]} );
    data_targets.push( {y:targets[i]} )
  }

// escalas
var eX,eY
var eX_,eY_

// dominio de la escala de color: la horquilla de la variable "varZ"
colors=['paleVioletRed','#2C005B ']
dominio=[0,1]

var margin = {top: 60, right: 150, bottom: 250, left: 350},
        width = 1500, 
        height = 1000;



// ZOOM
    //////////////////////////////////////////////////////////////////////////////////////////////////
    
    // definimos el comportamiento zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 32])
        .on("zoom", zoomed);

// ESCALAS Y EJES
    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Límites de las escalas X, Y, Z (color)
    extentX = d3.extent(data,function(d){return (d.pcaX+300);})
    extentY = d3.extent(data,function(d){return (d.pcaY+62);})

  // definimos escalas X e Y
    eX = d3.scaleLinear().domain(extentX).range([margin.left+50,  width-500])
    eY = d3.scaleLinear().domain(extentY).range([height-margin.bottom, margin.top])

// definimos ejes X e Y a partir de las escalas
    xAxis = d3.axisBottom(eX);
    yAxis = d3.axisLeft(eY); 



    // SCATTERPLOT: CREACIÓN
    //////////////////////////////////////////////////////////////////////////////////////////////////

// Creamos un nodo svg que contendrá nuestros círculos

var svg = d3.select("#chart")    
      .append('svg')        // añadimos nodo svg
      .attr('width',width)      // le damos atributos (width)
      .attr('height',height)      // height
      .attr('margin', 'margin-left=1000')
      .call(zoom)


// dibujamos los círculos del scatterplot
var circles = svg.selectAll(".pcaX")
              .data(data)

circles.append("title");

circles.enter().append("circle")
      .attr('cx', function(d){return eX(d.pcaX ); })
      .attr('cy', function(d){return eY(d.pcaY); })
      .attr('r',5)     // asignamos tamaño
      .data(data_targets)
      .style('fill',function(d){return colors[d.y]})    // asignamos color según la escala 
                                        // de color definida arriba
      .style('opacity',.65)
    


// EJES X e Y
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // dibujamos ("renderizamos") los ejes

    // renderizamos el eje X
    svg.append("g")                             // creamos un grupo svg
      .attr("class","x axis1")                       // le asignamos las clases x, axis
      .attr("transform","translate(0," + (height-margin.bottom) + ")")  // desplazamos el grupo (traslación)
                                        // para que se muestre abajo en vez de arriba
      .call(xAxis)                            // renderizamos los ejes, (mediante la 
                                        // llamada a la función xAxis)
    // renderizamos el eje Y
    svg.append("g")
      .attr("class","y axis1")
      .attr("transform","translate(" + margin.left + ",0)")
      .call(yAxis)  


// LEYENDA
//////////////////////////////////////////////////////////
var legend = svg.selectAll(".legend")
    .data(colors);

legend.enter().append('g')
    .attr("class","legend")
    .append("rect")
    .attr("x",1000)
    .attr("y", function(d, i) {return (i*50)+100; })
    .attr("width", 30)
    .attr("height", 30)
    .style("fill", function(d, i) {return colors[i]; })



d3.selectAll(".legend")
    .data(dominio)
    .append("text")
    .text(function(d){
      if (d==1)
        return ("Maligno")
      else
        return ("Benigno")
    })
    .attr("x", 1040)
    .attr("y", function(d, i) { return (i*50)+120;});


legend.exit().remove();






// CALLBACK DEL ZOOM
//////////////////////////////////////////////////////////////////////////////////////////////////
function zoomed()
{
  

  // definimos escalas nuevas
  // las originales siguen siendo eX, eY
  // el comportamiento zoom nos devuelve la transformación
  // entre la siguación original (eX, eY) y la situación
  // actual (eX_, eY_)
  eX_ = d3.event.transform.rescaleX(eX)
  eY_ = d3.event.transform.rescaleY(eY)
  

  // actualizamos la gráfica con las escalas nuevas
  update(eX_,eY_)
}

function update(escalaX,escalaY)
{


  // reconfiguramos los ejes X, Y conn las nuevas escalas
  // esto produce efectos:
  //   1) al actualizar los ejes
  //   2) al actualizar los puntos
  xAxis.scale(escalaX)
  yAxis.scale(escalaY)



  // actualizamos los ejes x e y 
  // seleccionamos elemento de las clases ".x.axis" y ".y.axis" 
  // y llamamos a los métodos xAxis e yAxis que redibujan las escalas
  d3.select('.x.axis1').call(xAxis)
  d3.select('.y.axis1').call(yAxis)
  

  // actualizamos los puntos usando las escalas escalaX, escalaY
  // dibujamos los círculos del scatterplot
  svg.selectAll('circle')
  .data(data)  // vinculamos los datos a la selección de círculos
  .attr('cx',function(d){return escalaX(d.pcaX )})
  .attr('cy',function(d){return escalaY(d.pcaY )})


}
         