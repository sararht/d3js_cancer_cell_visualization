d3.json("static/data/data_scatter.json", function(error, graphData) {


	datos=graphData


	// Variables de configuración de la app
	var width  = 800
	var height = 800
	var margin = {top: 40, right: 40, bottom: 80, left: 60};

	var width_splom = 300
	var height_splom = 300
	var margin_splom = {top: 20, right: 20, bottom: 40, left: 30};


	// variables para los tres canales
	var varX = 'radius_mean'
	var varY = 'texture_mean'
	var varZ = 'diagnosis_M' //Color
	var varRadio = 'radius_mean'

	// variables para los tres canales SPLOM
	var varX_splom 
	var varY_splom 
	var varZ_splom 

	var variables

	// ejes
	var xAxis, yAxis, xAxis_splom, yAxis_splom

	// escalas
	var eX,eY




	// ESCALAS Y EJES
	//////////////////////////////////////////////////////////////////////////////////////////////////
	// Límites de las escalas X e Y
	extentX = d3.extent(datos,function(d){return +d[varX]})
	extentY = d3.extent(datos,function(d){return +d[varY]})


	// dominio de la escala de color: la horquilla de la variable "varZ"
	step = 1
	dominio = [0,1]


	rango=['paleVioletRed','#2C005B ']
	// creamos la escala para que vincule el valor de "varZ" con un color
	c = d3.scaleLinear().domain(dominio).range(rango)


	// definimos escalas X e Y
	eX = d3.scaleLinear().domain(extentX).range([margin.left,  width-margin.right])
	eY = d3.scaleLinear().domain(extentY).range([height-margin.bottom, margin.top])


	// copiamos las escalas eX y eY. eX_ y eY_ tienen el valor actual de las escalas
	eX_ = eX
	eY_ = eY


	// definimos ejes X e Y a partir de las escalas
	xAxis = d3.axisBottom(eX);
	yAxis = d3.axisLeft(eY); 


	// ZOOM
	//////////////////////////////////////////////////////////////////////////////////////////////////

	// definimos el comportamiento zoom
	var zoom = d3.zoom()
	    .scaleExtent([1, 32])
	    .on("zoom", zoomed);

	// nombres de las variables
	variables=Object.keys(datos[0])


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// SPLOM

			

			
	var width_s = 800,
	size_s = 200,
	padding_s = 30;

	// Escalas ejes
	eX_s = d3.scaleLinear().range([padding_s / 2, size_s - padding_s / 2]);
	eY_s = d3.scaleLinear().range([size_s - padding_s / 2, padding_s / 2]);

	// definimos ejes X e Y a partir de las escalas del SPLOM
	xAxis_s = d3.axisBottom(eX_s);
	yAxis_s = d3.axisLeft(eY_s); 


	var domainByTrait = {},
	//traits=Object.keys(datos[0])
	traits=["radius_mean", "texture_mean", "perimeter_mean", "area_mean", "smoothness_mean", "compactness_mean", "concavity_mean", "concave points_mean", "symmetry_mean", "fractal_dimension_mean"]
	n = traits.length;

	traits.forEach(function(trait) {
		domainByTrait[trait] = d3.extent(datos, function(d) { return d[trait]; });
	});

	xAxis_s.tickSize(size_s * n);
	yAxis_s.tickSize(-size_s * n);

		

	var brush = d3.brush()
		.extent([[eX_s.range()[0], eY_s.range()[1]], [eX_s.range()[1],eY_s.range()[0]]])
	    .on("start", brushstart)
	    .on("brush", brushmove)

	var svg = d3.select('#splom').append("svg")
		.attr("width", size_s * n + padding_s)
		.attr("height", size_s * n + padding_s)
		.append("g")
		.attr("transform", "translate(" + padding_s + "," + padding_s / 2 + ")");

	svg.selectAll(".x.axis")
		.data(traits)
		.enter().append("g")
		.attr("class", "x axis")
		.attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size_s + ",0)"; })
		.each(function(d) { eX_s.domain(domainByTrait[d]); d3.select(this).call(xAxis_s); });

	 svg.selectAll(".y.axis")
		.data(traits)
		.enter().append("g")
		.attr("class", "y axis")
		.attr("transform", function(d, i) { return "translate(0," + i * size_s + ")"; })
		.each(function(d) { eY_s.domain(domainByTrait[d]); d3.select(this).call(yAxis_s); });


	var cell = svg.selectAll(".cell")
		.data(cross(traits, traits))
		.enter().append("g")
		.attr("class", "cell")
		.attr('id',function(d,i){return ('cell'+i)})
		.attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size_s + "," + d.j * size_s + ")"; })
		.each(plot);

	  // Títulos de los ejes
	  cell.data(cross(traits, traits))
		.append("text")
		.attr("x", 55)
		.attr("y", size_s-15)
		.attr("dy", ".71em")
		.text(function(d) { return d.x; })
		.attr('fill','black')
		.style('font-size','13px');

	  cell.data(cross(traits, traits))
		.append("text")
		.attr("x", -145)
		.attr("y", 0)
		.attr("dy", ".71em")
		.text(function(d) { return d.y; })
		.attr('fill','black')
		.attr('transform',function(d) {return "rotate(-90)" })
		.style('font-size','13px');



	cell.call(brush);


	function plot(p) {
		var cell = d3.select(this);

		eX_s.domain(domainByTrait[p.x]);
		eY_s.domain(domainByTrait[p.y]);

		cell.append("rect")
		    .attr("class", "frame")
		    .attr("x", padding_s / 2)
		    .attr("y", padding_s / 2)
		    .attr("width", size_s - padding_s)
		    .attr("height", size_s - padding_s);

		cell.selectAll("circlesS")
		    .data(datos)
		  .enter().append("circle")
		  	.attr('class','circlesS')
		    .attr("cx", function(d) { return eX_s(d[p.x]); })
		    .attr("cy", function(d) { return eY_s(d[p.y]); })
		    .attr("r", 2)
		    .style("fill", function(d){return c(+d['diagnosis_M'])});
	}

	  var brushCell;

	// Clear the previously-active brush, if any.
	function brushstart(p) {
		console.log('start')
		
		if (brushCell!== this ) {

		console.log(this)	
		  d3.select(brushCell).call(brush.move,null);
		  eX_s.domain(domainByTrait[p.x]);
		  eY_s.domain(domainByTrait[p.y]);
		  brushCell = this;

		}
	}

	// Highlight the selected circles.
	function brushmove(p) {
		console.log('move')
		var escala=d3.scaleLinear()
			.domain(eX_s.range()[0], eX_s.range()[1])
			.range(0,size_s)

		pos=d3.event.selection
		d3.selectAll(".circlesS").classed("hidden", function(d) {
		if (pos!=null)
			return (pos[0][0] > eX_s(d[p.x]) || eX_s(d[p.x]) > pos[1][0] || pos[0][1] > eY_s(d[p.y]) || eY_s(d[p.y]) > pos[1][1]);
	})
	}


	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   	       	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





	// COMBO BOXES (SELECCIÓN)
	//////////////////////////////////////////////////////////////////////////////////////////////////
	// añadimos un objeto tipo "selección" (combo X)
	svg = d3.select('#LeyendaCB')
		.append('text')
		.text('Eje X | ')


	svg = d3.select('#LeyendaCB')
		.append('text')
		.text(' | Eje Y ')	

	comboX = d3.select('#ComboBoxes')
		.append('select')
		.on('change',function(d){
			varX 	= variables[comboX.property('selectedIndex')]
			extentX = d3.extent(datos,function(d){return +d[varX]})
			eX.domain(extentX)
			eX_ = eX
			eY_ = eY

			update_transicion(eX,eY)
		})
				

	// añadimos las opciones (nombres de las variables) al comboX
	comboXopt = comboX			
		.selectAll('option').data(variables)
		.enter()
		.append('option')
		.text(function(d){return d})


	// añadimos objeto tipo "selección" (comboY)
	comboY = d3.select('#ComboBoxes')
		.append('select')
		.on('change',function(d){
			varY 	= variables[comboY.property('selectedIndex')]
			extentY = d3.extent(datos,function(d){return +d[varY]})
			eY.domain(extentY)
			eX_ = eX
			eY_ = eY

			update_transicion(eX,eY)
		})

	// añadimos las opciones (nombres de las variables) al comboY
	comboYopt = comboY			
		.selectAll('option').data(variables)
		.enter()
		.append('option')
		.text(function(d){return d})


	comboX.property('selectedIndex',0) 
	comboY.property('selectedIndex',1) 



			
			



	// SCATTERPLOT: CREACIÓN
	//////////////////////////////////////////////////////////////////////////////////////////////////

	// Creamos un nodo svg que contendrá nuestros círculos
	svg = d3.select('#Scatter')			// seleccionamos el nodo contenedor ('Scatter')
		.append('svg')				// añadimos nodo svg
		.attr('width',width)			// le damos atributos (width)
		.attr('height',height)			// height
		.call(zoom)

		
	  	    
	// dibujamos los círculos del scatterplot
	svg.selectAll('circs')
		.data(datos)	// vinculamos los datos a la selección de círculos
		.enter()		// para cada dato (que no tiene círculo) ...
		.append('circle')	// ... añadir un círculo con los siguientes atributos:					
		.attr('cx',function(d){return eX(d[varX])})
		.attr('cy',function(d,i){return eY(d[varY])})
		.attr('r',function(d){return 1 + +d[varRadio]*0.8})			
		.style('fill',function(d){return c(+d[varZ])})		
																	
		.style('opacity',.8)
		.on('mouseover',
		function(d,i)
		{
			
			d3.select('.etiqueta')
			.datum(d)
			.attr('x',eX_(d[varX]))
			.attr('y',eY_(d[varY]))
			.text(function(d,i){
				if (d['diagnosis_M']==0)
					return 'Benigno'
				else return 'Maligno'
			})
			d3.select('.etiquetaRect')
			.datum(d)
			.attr('x',eX_(d[varX])-6)
			.attr('y',eY_(d[varY])-20)
			

			d3.select("#RadiusMean")
			.text(d['radius_mean'])
			d3.select("#RadiusSE")
			.text(d['radius_se'])
			d3.select("#RadiusWorst")
			.text(d['radius_worst'])

			d3.select("#TextureMean")
			.text(d["texture_mean"])
			d3.select("#TextureSE")
			.text(d["texture_se"])
			d3.select("#TextureWorst")
			.text(d["texture_worst"])

			d3.select("#PerimeterMean")
			.text(d["perimeter_mean"])
			d3.select("#PerimeterSE")
			.text(d["perimeter_se"])
			d3.select("#PerimeterWorst")
			.text(d["perimeter_worst"])

			d3.select("#AreaMean")
			.text(d["area_mean"])
			d3.select("#AreaSE")
			.text(d["area_se"])
			d3.select("#AreaWorst")
			.text(d["area_worst"])

			d3.select("#SmoothnessMean")
			.text(d["smoothness_mean"])
			d3.select("#SmoothnessSE")
			.text(d["smoothness_se"])
			d3.select("#SmoothnessWorst")
			.text(d["smoothness_worst"])

			d3.select("#CompactnessMean")
			.text(d["compactness_mean"])
			d3.select("#CompactnessSE")
			.text(d["compactness_se"])
			d3.select("#CompactnessWorst")
			.text(d["compactness_worst"])

			d3.select("#ConcavityMean")
			.text(d["concavity_mean"])
			d3.select("#ConcavitySE")
			.text(d["concavity_se"])
			d3.select("#ConcavityWorst")
			.text(d["concavity_worst"])

			d3.select("#ConcavePointsMean")
			.text(d["concave points_mean"])
			d3.select("#ConcavePointsSE")
			.text(d["concave points_se"])
			d3.select("#ConcavePointsWorst")
			.text(d["concave points_worst"])

			d3.select("#SimmetryMean")
			.text(d["symmetry_mean"])
			d3.select("#SimmetrySE")
			.text(d["symmetry_se"])
			d3.select("#SimmetryWorst")
			.text(d["symmetry_worst"])

			d3.select("#FractalDimensionMean")
			.text(d["fractal_dimension_mean"])
			d3.select("#FractalDimensionSE")
			.text(d["fractal_dimension_se"])
			d3.select("#FractalDimensionWorst")
			.text(d["fractal_dimension_worst"])

		})

			


	// Etiqueta con información de los puntos (tooltip)

	svg.append('rect')
		.attr('class','etiquetaRect')
		.attr('width',70)
		.attr('height',30)
		.attr('fill','white')
		.style('opacity',0.6)
	svg.append('text')
		.attr('class','etiqueta')





	// EJES X e Y
	//////////////////////////////////////////////////////////////////////////////////////////////////


	// renderizamos el eje X
	svg.append("g")															// creamos un grupo svg
		.attr("class","x axis1")												// le asignamos las clases x, axis
		.attr("transform","translate(0," + (height-margin.bottom/2) + ")")	// desplazamos el grupo (traslación)
																			// para que se muestre abajo en vez de arriba
		.call(xAxis)														// renderizamos los ejes, (mediante la 
																			// llamada a la función xAxis)
	// renderizamos el eje Y
	svg.append("g")
		.attr("class","y axis1")
		.attr("transform","translate(" + margin.left + ",0)")
		.call(yAxis)	


	// etiqueta del eje Y
	svg.append("text")						
	    .attr("class", "y label")				// asignamos las clases "y" y "label".
	    										//  Nos permiten asignar tipo de letra, color, etc. a medida.
	    .attr("text-anchor", "end")				// anclamos el final del texto a las coordenadas (x,y)
	    .attr("y", +margin.left + 6)			// desplazamos convenientemente el texto...
	    .attr("x", -margin.bottom/2)			
	    .attr("dy", ".75em")
	    .attr("transform", "rotate(-90)")		// ... y lo rotamos 90º
	    .text(varY);

	// etiqueta del eje X
	svg.append("text")
	    .attr("class", "x label")
	    .attr("text-anchor", "end")					// anclamos el final del texto a las coordenadas (x,y)
	    .attr("x", width - margin.right)			// colocamos el final del texto (previamente anclado) 
	    .attr("y", height - margin.bottom/2 - 6)	//
	    .text(varX);




	//////////////////////////// LEYENDA////////////////////////////////
	    
	 
	// Leyenda

	var Leyenda= d3.select('#Scatter')
		  .append('svg')
	      .attr('class','leyenda')
	      .attr('margin-left',30)

	 Leyenda.append("rect")
	      .attr('class', "leyendaRect")
	      .attr('width', 30)
	      .attr('height', 30)
	      .attr('fill', rango[0])
	      .attr('x', 10)
	      .attr ('y',0)

	 Leyenda.append("rect")
	      .attr('class', "leyendaRect")
	      .attr('width', 30)
	      .attr('height', 30)
	      .attr('fill', rango[1])
	      .attr('x', 10)
	      .attr ('y',40)


	Leyenda.append('text')
	      .attr('class', 'leyendaText')
	      .attr('fill','black')
	      .text('Benigno')
	      .attr('x', 50)
	      .attr ('y',20)


	Leyenda.append('text')
	      .attr('class', 'leyendaText')
	      .attr('fill','black')
	      .text('Maligno')
	      .attr('x', 50)
	      .attr ('y',60)



		

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




	// SCATTERPLOT: ACTUALIZACIÓN
	//////////////////////////////////////////////////////////////////////////////////////////////////

	function update(escalaX,escalaY)
	{

		varX = variables[comboX.property('selectedIndex')]
		varY = variables[comboY.property('selectedIndex')]
		

		// reconfiguramos los ejes X, Y conn las nuevas escalas
		// esto produce efectos:
		// 	 1) al actualizar los ejes
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
			.data(datos)	// vinculamos los datos a la selección de círculos
			.attr('cx',function(d){return escalaX(d[varX])})
			.attr('cy',function(d){return escalaY(d[varY])})
			.attr('r',function(d){return 1 + +d[varRadio]*0.8})	  // Siempre tamaño de la glucosa ¿?
			.style('fill',function(d){return c(+d[varZ])})  // color según la escala 
			.style('opacity',.8)


		// etiqueta del eje X
		svg.select(".x.label")
		    .text(varX);

		// etiqueta del eje Y
		svg.select(".y.label")
		    .text(varY);

	}

	function update_transicion(escalaX,escalaY)
	{

		varX = variables[comboX.property('selectedIndex')]
		varY = variables[comboY.property('selectedIndex')]


		// reconfiguramos los ejes X, Y conn las nuevas escalas
		// esto produce efectos:
		// 	 1) al actualizar los ejes
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
			.data(datos)	// vinculamos los datos a la selección de círculos
			.transition()
			.duration(1000)
			.attr('cx',function(d){return escalaX(d[varX])})
			.attr('cy',function(d){return escalaY(d[varY])})
			.attr('r',function(d){return 1 + +d[varRadio]*0.8})	  // Siempre tamaño fijo
			.style('fill',function(d){return c(+d[varZ])})  // color según la escala 
			.style('opacity',.8)


		// etiqueta del eje X
		svg.select(".x.label")
		    .text(varX);

		// etiqueta del eje Y
		svg.select(".y.label")
		    .text(varY);

	}

	function cross(a, b) {
	  var c = [], n = a.length, m = b.length, i, j;
	  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
	  return c;
	}

});
