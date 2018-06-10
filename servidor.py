"""
Fichero que genera una aplicación Flask
"""

import json

from flask import Flask, render_template, url_for
import pandas as pd
import numpy as np
from sklearn.decomposition import PCA


##########################################################
# Leer datos
df = pd.read_csv('data.csv', low_memory=False)
M=212;
B=357;

# Targets
y = df.diagnosis    # M or B 
y_df= pd.get_dummies(y,drop_first=True) # dropping the column called diagnosis and having a columns of 0 and 1
y_df=y_df['M']

# Eliminar la última columna, el id y el diagnóstico 
list = ['id','Unnamed: 32','diagnosis']
x = df.drop(list,axis = 1 )

df_scatter_aux=df.drop(['id','Unnamed: 32'],axis=1)
df_scatter_aux2=pd.get_dummies(df_scatter_aux,'diagnosis')
df_scatter=df_scatter_aux2.drop('diagnosis_B',axis=1)


# Data agrupado por Malignos y Benignos
data_diagnosis2=df.sort_values(by=['diagnosis'])
data_diagnosis=data_diagnosis2.set_index('diagnosis')
data_benignos=data_diagnosis.loc['B']
data_malignos=data_diagnosis.loc['M']
data_malignos['mi_indice']= range(0,M)
data_benignos['mi_indice']= range(0,B)
data_benignos=data_benignos.set_index('mi_indice')
data_malignos=data_malignos.set_index('mi_indice')




##########################################################



app = Flask(__name__, static_url_path='/static')



@app.route("/")
def index():

    return render_template("index.html")

@app.route("/Correlaciones")
def Correlaciones():
   corr_todo=x.corr();
   chart_data = corr_todo.to_json('data_corr.json')
   data={'chart_data': chart_data}
   return render_template("Correlaciones.html", data=data)
   
@app.route("/PCA")

def CalculoPCA():
  # Se transforman los datos en un array
  X = x.values
  # Se invoca el metodo PCA.
  pca = PCA(n_components=2)
  pca_2d = pca.fit_transform(X)
  pca_2d_df=pd.DataFrame(pca_2d)
  chart_data = pca_2d_df.to_json('data_pca.json')
  y_df_json=y_df.to_json('targets_pca.json')
  data={'chart_data': chart_data, 'targets':y_df_json}
  return render_template("PCA.html", data=data)

@app.route("/Diag_Radar")

def Diag_Radar():
  chart_data=x.to_json('data_dg_mean.json')

  dataM=data_malignos.to_json('dataM_dg_mean.json')
  dataB=data_benignos.to_json('dataB_dg_mean.json')
  y_df_json=y_df.to_json('targets_dg_mean.json')
  data={'chart_data': chart_data, 'dataM':dataM, 'dataB':dataB, 'targets':y_df_json}
  return render_template("Diag_Radar.html", data=data)

@app.route("/Diag_Radar_se")

def Diag_Radar_se():
  chart_data=x.to_json('data_dg_se.json')

  dataM=data_malignos.to_json('dataM_dg_se.json')
  dataB=data_benignos.to_json('dataB_dg_se.json')
  y_df_json=y_df.to_json('targets_dg_se.json')
  data={'chart_data': chart_data, 'dataM':dataM, 'dataB':dataB, 'targets':y_df_json}
  return render_template("Diag_Radar_se.html", data=data)


@app.route("/Diag_Radar_worst")

def Diag_Radar_worst():
  chart_data=x.to_json('data_dg_worst.json')

  dataM=data_malignos.to_json('dataM_dg_worst.json')
  dataB=data_benignos.to_json('dataB_dg_worst.json')
  y_df_json=y_df.to_json('targets_dg_worst.json')
  data={'chart_data': chart_data, 'dataM':dataM, 'dataB':dataB, 'targets':y_df_json}
  return render_template("Diag_Radar_worst.html", data=data)


@app.route("/ScatterPlot")
def ScatterPlot():
   
   chart_data = df_scatter.to_json('data_scatter.json', orient="records")
   data={'chart_data': chart_data}
   return render_template("ScatterPlot.html", data=data)



if __name__ == "__main__":
  app.debug=True
  app.run(host='0.0.0.0')
