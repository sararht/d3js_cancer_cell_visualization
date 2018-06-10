
function radarDiagram(datos, datosM, datosB, id_celB, id_celM, margenTop, margenIzq, id) 
{


  var n_malignos=Object.keys(datosM[0].value).length;
  var n_benignos=Object.keys(datosB[0].value).length;

  var margin = {top: margenTop, right: 100, bottom: 50, left: margenIzq},
    width = 800, 
    height = 4000

  var cfg = {
    w: 500,        //Width of the circle
    h: 500,        //Height of the circle
    levels: 5,       //How many levels or inner circles should there be drawn
    maxValue: 0,       //What is the value that the biggest circle will represent
    labelFactor: 1.25,   //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60,     //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35,   //The opacity of the area of the blob
    dotRadius: 4,      //The size of the colored circles of each blog
    opacityCircles: 0.3,   //The opacity of the circles of each blob
    strokeWidth: 2,    //The width of the stroke around each blob

  }
  colors=['paleVioletRed','#2C005B ']

  var maximo=0
  var maxValues_mean=[]
  for (var i=0; i<10; i++)
  {
    for (var j=0; j<569; j++)
    {
      var maximo=Math.max(maximo,datos[i].value[j])
    }
    maxValues_mean.push({max:maximo})
    maximo=0
  }

    


  var allAxis = (datos.map(function(d, i){return d.axis})), //Names of each axis
    total = allAxis.length,         //The number of different axes
    radius = Math.min(cfg.w/2, cfg.h/2),  //Radius of the outermost circle
    Format = d3.format('.0%'),        //Percentage formatting
    angleSlice = Math.PI * 2 / total;   //The width in radians of each "slice"


    
    //Scale for the radius
  var rScale = []

  for (var i=0;i<10;i++)
  {
    rScale[i]=d3.scaleLinear()
    .range([0, radius])
    .domain([0, maxValues_mean[i].max])

    allAxis[i]=({escala: rScale, max:maxValues_mean[i].max}) //OJO AQUÍ
  }
     

  var svg = d3.select("#chart")
    .append("svg")
    .attr('class','contenedorRadar')
    .attr("width",  800 + margin.left + margin.right)
    .attr("height", 800 + margin.top + margin.bottom)

  /////////////////SLIDER : ID BENIGNOS////////////////////

  var x = d3.scaleLinear()
    .domain([0, n_benignos-1])
    .range([0, 400])
    .clamp(true);

  var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left/2 + "," + height / 2 + ")");


  slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .attr ("y1", -1950)
    .attr ("y2", -1950)

  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));


  slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(10))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")


  var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle"+id)
    .attr("r", 9)
    .attr("cy",-1950)
    .attr("cx",)


  function dragstarted(d) {
    d3.selectAll(".handle").raise().classed("active", true);
  }

  function dragged(d) {
    var pos
    if (d3.event.x<0)
      pos= x.range()[0]
    else if (d3.event.x>x.range()[1])
      pos= x.range()[1]
    else pos= d3.event.x
    
    d3.select(".handle"+id)
    .attr("cx", pos);

    var idn_B=(x.invert(pos)).toFixed(0);
    update_idB(idn_B);

    d3.selectAll('.textID_B')
      .text('id: '+idn_B)
  }

  function dragended(d) {
    d3.select(".handle").raise().classed("active", false);
  }


  //Leyenda

  slider.append('text')
    .attr("x",-250)
    .attr("y", -1945)
    .text("Casos de células benignas: ")

  slider.append("text")
    .attr('class','textID_B')
    .text('id: '+ id_celB)
    .attr('x',410)
    .attr('y',-1945)

  /////////////////SLIDER : ID MALIGNOS////////////////////

  var xM = d3.scaleLinear()
    .domain([0, n_malignos-1])
    .range([0, 400])
    .clamp(true);

  var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left/2 + "," + height / 2 + ")");

  slider.append("line")
    .attr("class", "track")
    .attr("x1", xM.range()[0])
    .attr("x2", xM.range()[1])
    .attr ("y1", -1900)
    .attr ("y2", -1900)
   
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
      .on("start", dragstarted_M)
      .on("drag", dragged_M)
      .on("end", dragended_M));


  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(xM.ticks(10))
    .enter().append("text")
      .attr("x", xM)
      .attr("text-anchor", "middle")


  var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handleM"+id)
    .attr("r", 9)
    .attr("cy",-1900)
    .attr("cx",)


  function dragstarted_M(d) {
    d3.selectAll(".handleM").raise().classed("active", true);
  }

  function dragged_M(d) {
    var posM
    if (d3.event.x<0)
      posM= xM.range()[0]
    else if (d3.event.x>xM.range()[1])
      posM= xM.range()[1]
    else posM= d3.event.x
    
    d3.select(".handleM"+id)
      .attr("cx", posM);

    var idn_M=(xM.invert(posM)).toFixed(0);
    update_idM(idn_M);

    d3.selectAll('.textID_M')
      .text('id: '+idn_M)
  }

  function dragended_M(d) {
    d3.select(".handleM").raise().classed("active", false);
  }


  //Leyenda

  slider.append('text')
    .attr("x",-250)
    .attr("y", -1895)
    .text("Casos de células malignas:")

  slider.append("text")
    .attr('class','textID_M')
    .text('id: '+ id_celM)
    .attr('x',410)
    .attr('y',-1895)


  /////////////////////////////////////////////////////////


    //Append a g element    
    var svg = d3.select("svg")
      .append("g")
      .attr("class", "Radar")
      .attr("width", 1000 + margin.left + margin.right)
      .attr("height", 1000 + margin.top + margin.bottom)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  //Draw the background circles
   var axisGrid=svg.selectAll(".levels")
      .data(d3.range(1,(cfg.levels+1)).reverse())
      .enter().append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i){return radius/cfg.levels*d;})
        .style("fill", "#CDCDCD")
        .style("stroke", "CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)


  // Dibujar los ejes
  for (var i=0; i<10; i++)
  {

    svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", rScale[i](maxValues_mean[i].max*1.1) * Math.cos(angleSlice*i - Math.PI/2))
      .attr("y2", rScale[i](maxValues_mean[i].max*1.1) * Math.sin(angleSlice*i - Math.PI/2))
      .attr("class", "axis")
      .style("stroke", "white")
      .style("stroke-width", "2px")
  }


  //Text indicating at what % each level is
   var axisGrid=svg.selectAll(".axisLabel")
    .data(d3.range(1,(cfg.levels+1)).reverse())
    .enter().append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function(d){return -d*radius/cfg.levels;})
    .attr("dy", "0.4em")
    .style("font-size", "10px")
    .attr("fill", "#737373")
    .text(function(d,i) { return (Format((maxValues_mean[0].max*(d/cfg.levels)/maxValues_mean[0].max))); });


  PolygonB=[]
  PolygonM=[]
  for (var i=0;i<10;i++)
  {
      PolygonB.push({x:rScale[i](datosB[i].value[id_celB]) * Math.cos(angleSlice*i - Math.PI/2), y:rScale[i](datosB[i].value[id_celB]) * Math.sin(angleSlice*i - Math.PI/2)}) //Benigno
      PolygonM.push({x:rScale[i](datosM[i].value[id_celM]) * Math.cos(angleSlice*i - Math.PI/2), y:rScale[i](datosM[i].value[id_celM]) * Math.sin(angleSlice*i - Math.PI/2)}) //Maligno
  }
  Polygons=[]




  //Append the labels at each axis
  for (var i=0; i<10; i++)
  {
    svg.append("text")
      .attr("class", "legend")
      .style("font-size", "13px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", rScale[i](maxValues_mean[i].max * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2))
      .attr("y", rScale[i](maxValues_mean[i].max * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2))
      .text(datos[i].Axis)
  }




  ///////////////////////////////////////////////// DIBUJAR POLÍGONO MALIGNO //////////////////////////////////////

  svg.append("polygon")
  .attr("class","PolMaligno")
  .attr("points", 
    function(){a = []; 
      for (var i = PolygonM.length - 1; i >= 0; i--) {
        a = a.concat([PolygonM[i].x, PolygonM[i].y]) 
      }
      return a
    } )
  .attr("fill", colors[1])
  .attr("opacity", 0.3)
  .on("mouseover", function(d,i)
    { // esto se ejecuta cuando pasamos el ratón por el punto
      
      d3.select(this)
        .attr("stroke",colors[0])
        .attr("opacity", 0.8)

      d3.select('.PolBenigno')
        .attr('visibility','hidden')


    })
  .on("mouseout", function(d,i)
    { // esto se ejecuta cuando sacamos el ratón
      
      d3.select(this)
        .attr("stroke","none")
        .attr("opacity", 0.3)

      d3.select('.PolBenigno')
        .attr('visibility','visible')

    });


  var CirclesMalignos=svg.selectAll("circs1")
  .data(datosM)
  CirclesMalignos.enter().append("circle")
      .attr("class", "CircleM")
      .attr("r", 5)
      .style("fill", colors[1])
      .attr("cx", function (d,i){return (rScale[i](d.value[id_celM]) * Math.cos(angleSlice*i - Math.PI/2))})
      .attr("cy", function (d,i){return (rScale[i](d.value[id_celM]) * Math.sin(angleSlice*i - Math.PI/2))})
      .attr("stroke", "black")
      .on("mouseover", function(d,i)
      {
        d3.select(this)
        .attr("stroke-width", 3)

        d3.select('.tooltiptext')
        .datum(d)
        .attr('x',420)
        .attr('y',-160)
        .attr('visibility', 'visible')
        .text((function(d){return d.Axis + ' (maligno) : ' + d.value[id_celM].toFixed(3) }))
        .style('font-weight','bold')

        d3.select('.PolBenigno')
        .attr('visibility','hidden')

        
      })
      .on("mouseout", function(d,i)
      {
        d3.select(this)
        .attr("stroke-width", 1)

        d3.select('.tooltiptext')
        .attr('visibility', 'hidden');

        d3.select('.PolBenigno')
        .attr('visibility','visible')

        
      })

  ///////////////////////////////////////////////// DIBUJAR POLÍGONO BENIGNO //////////////////////////////////////

  svg.append("polygon")
  .attr("class","PolBenigno")
  .attr("points", 
    function(){a = []; 
      for (var i = PolygonB.length - 1; i >= 0; i--) {
        a = a.concat([PolygonB[i].x, PolygonB[i].y]) 
      }
      return a
    } )
  .attr("fill", colors[0])
  .attr("opacity", 0.3)
  .on("mouseover", function(d,i)
    { // esto se ejecuta cuando pasamos el ratón por el punto
      
      d3.select(this)
        .attr("stroke",colors[1])
        .attr("opacity", 0.8)

      d3.select('.PolMaligno')
        .attr('visibility','hidden')
    })
  .on("mouseout", function(d,i)
    { // esto se ejecuta cuando sacamos el ratón
      
      d3.select(this)
        .attr("stroke","none")
        .attr("opacity", 0.3)

      d3.select('.PolMaligno')
        .attr('visibility','visible')

    });



  var CirclesBenignos=svg.selectAll("circs2")
  .data(datosB)
  CirclesBenignos.enter().append("circle")
      .attr("class", "CircleB")
      .attr("r", 5)
      .style("fill", colors[0])
      .attr("cx", function (d,i){return (rScale[i](d.value[id_celB]) * Math.cos(angleSlice*i - Math.PI/2))})
      .attr("cy", function (d,i){return (rScale[i](d.value[id_celB]) * Math.sin(angleSlice*i - Math.PI/2))})
      .attr("stroke", "black")
      .on("mouseover", function(d,i)
      {
        d3.select(this)
        .attr("stroke-width", 3)

        d3.select('.tooltiptext')
        .datum(d)
        .attr('x',420)
        .attr('y',-160)
        .attr('visibility', 'visible')
        .text((function(d){return d.Axis + ' (benigno) : ' + d.value[id_celB].toFixed(3) }))
        .style('font-weight','bold')

        d3.select('.PolMaligno')
        .attr('visibility','hidden')
    
      })

      .on("mouseout", function(d,i)
      {
        d3.select(this)
        .attr("stroke-width", 1)

        d3.select('.tooltiptext')
        .attr('visibility', 'hidden');

       d3.select('.PolMaligno')
        .attr('visibility','visible')
    
      })



  // LEYENDA
  //////////////////////////////////////////////////////////
      
   
  // Leyenda
      var etiqueta= svg.append('g')
            .attr('class','leyenda')

       etiqueta.append("rect")
            .attr('class', "leyendaRect")
            .attr('width', 30)
            .attr('height', 30)
            .attr('fill', colors[0])
            .attr('x', 420)
            .attr ('y',-300)

       etiqueta.append("rect")
            .attr('class', "leyendaRect")
            .attr('width', 30)
            .attr('height', 30)
            .attr('fill', colors[1])
            .attr('x', 420)
            .attr ('y',-250)


      etiqueta.append('text')
            .attr('class', 'leyendaText')
            .attr('fill','black')
            .text('Benigno')
            .attr('x', 460)
            .attr ('y',-280)


      etiqueta.append('text')
            .attr('class', 'leyendaText')
            .attr('fill','black')
            .text('Maligno')
            .attr('x', 460)
            .attr ('y',-230)
          


    /////// TOOLTIP

  var ToolTip = svg.append('g')
            .attr('class','tooltip')

      ToolTip.append('text')
            .attr('class', 'tooltiptext')
            .attr('fill','black')
            .attr('visibility', 'hidden');



  ///////////////////////////////////////////////// FUNCIÓN REDIBUJAR POLÍGONO BENIGNO //////////////////////////////////////

  function update_idB(id_nuevo)
  {
    id_celB=id_nuevo;
  // Redefinir círculos
  svg.selectAll(".CircleB")
  .data(datosB)
      .transition()
      .duration(1000)
      .attr("r", 5)
      .style("fill", colors[0])
      .attr("cx", function (d,i){return (rScale[i](d.value[id_nuevo]) * Math.cos(angleSlice*i - Math.PI/2))})
      .attr("cy", function (d,i){return (rScale[i](d.value[id_nuevo]) * Math.sin(angleSlice*i - Math.PI/2))})
      .attr("stroke", "black")
     

  // Redefinir polígono

  PolygonB=[]
  for (var i=0;i<10;i++)
  {
      PolygonB.push({x:rScale[i](datosB[i].value[id_nuevo]) * Math.cos(angleSlice*i - Math.PI/2), y:rScale[i](datosB[i].value[id_nuevo]) * Math.sin(angleSlice*i - Math.PI/2)})
     
  }


  svg.selectAll(".PolBenigno")
  .transition()
  .duration(1000)
  .attr("points", 
    function(){a = []; 
      for (var i = PolygonB.length - 1; i >= 0; i--) {
        a = a.concat([PolygonB[i].x, PolygonB[i].y]) 
      }
      return a
    } )
  .attr("fill", colors[0])
  .attr("opacity", 0.3)
  }


  ///////////////////////////////////////////////// FUNCIÓN REDIBUJAR POLÍGONO MALIGNO //////////////////////////////////////

  function update_idM(id_nuevo)
  {
    
    id_celM=id_nuevo;
  // Redefinir círculos
  svg.selectAll(".CircleM")
  .data(datosM)
      .transition()
      .duration(1000)
      .attr("r", 5)
      .style("fill", colors[1])
      .attr("cx", function (d,i){return (rScale[i](d.value[id_nuevo]) * Math.cos(angleSlice*i - Math.PI/2))})
      .attr("cy", function (d,i){return (rScale[i](d.value[id_nuevo]) * Math.sin(angleSlice*i - Math.PI/2))})
      .attr("stroke", "black")
     

  // Redefinir polígono

  PolygonM=[]
  for (var i=0;i<10;i++)
  {
      PolygonM.push({x:rScale[i](datosM[i].value[id_nuevo]) * Math.cos(angleSlice*i - Math.PI/2), y:rScale[i](datosM[i].value[id_nuevo]) * Math.sin(angleSlice*i - Math.PI/2)}) 
     
  }


  svg.selectAll(".PolMaligno")
  .transition()
  .duration(1000)
  .attr("points", 
    function(){a = []; 
      for (var i = PolygonM.length - 1; i >= 0; i--) {
        a = a.concat([PolygonM[i].x, PolygonM[i].y]) 
      }
      return a
    } )
  .attr("fill", colors[1])
  .attr("opacity", 0.3)
  }



  // Función que ejecuta el botón al ser pulsado
  d3.select('.BotonB')
    .on('click', function() 
      {  
        var interval=setInterval(funcion1,800)
        var id_pruebaB=0
        function funcion1()
        {
          idn_B=id_pruebaB;
          update_idB(id_pruebaB)
          d3.select('.handle1')
            .attr('cx',x(id_pruebaB))

          d3.select('.textID_B')
            .text('id: '+ id_pruebaB)

          id_pruebaB=id_pruebaB+1
          if (id_pruebaB==356)
            clearInterval(interval)

          d3.select('.BotonParoB')
          .on('click', function() 
            { 
              clearInterval(interval)
            });

        }

      });

    // Función que ejecuta el botón al ser pulsado
  d3.select('.BotonM')
    .on('click', function() 
      {  
        var interval=setInterval(funcion1,800)
        var id_pruebaM=0
        function funcion1()
        {
          idn_M=id_pruebaM;
          update_idM(id_pruebaM)
          d3.select('.handleM1')
            .attr('cx',xM(id_pruebaM))

          d3.select('.textID_M')
            .text('id: '+ id_pruebaM)


          id_pruebaM=id_pruebaM+1
          if (id_pruebaM==n_malignos-1)
            clearInterval(interval)

          d3.select('.BotonParoM')
          .on('click', function() 
            { 
              clearInterval(interval)
            });

        }

      });



}









