
var lista=[]
lista=['radius_mean','texture_mean','perimeter_mean','area_mean',
      'smoothness_mean','compactness_mean','concavity_mean',
      'concave points_mean','symmetry_mean','fractal_dimension_mean','radius_se','texture_se','perimeter_se','area_se',
      'smoothness_se','compactness_se','concavity_se',
      'concave points_se','symmetry_se','fractal_dimension_se',
      'radius_worst','texture_worst','perimeter_worst','area_worst',
      'smoothness_worst','compactness_worst','concavity_worst',
      'concave points_worst','symmetry_worst','fractal_dimension_worst'];


var data_worst = [];
var dataM_worst = [];
var dataB_worst = [];



for (var i=20; i<30; i++)
{
  data_worst.push( {Axis:lista[i], value:graphData[lista[i]]} )
  dataM_worst.push( {Axis:lista[i], value:graphDataM[lista[i]]})
  dataB_worst.push( {Axis:lista[i], value:graphDataB[lista[i]]})
}


radarDiagram(data_worst, dataM_worst, dataB_worst, 0, 0, 500, 1000, "1" )








