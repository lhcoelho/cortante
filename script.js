//declaração de variáveis
var fck;
var fyk;
var b;
var d;
var d1;
var vk;
var asw;
var fctm;
var rowMin;
var aswMin;
var fywk;
var modelo;

function dimensionarModelo1() {
  modelo = "1";
  dimensionar();
}
function dimensionarModelo2() {
  modelo = "2";
  dimensionar();
}

function dimensionar() {
  var resultado = document.getElementById("resultadoCortante");
  resultado.innerHTML =
    "</br> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp </br>" +
    "&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp";
  entradaDeDados();
  if (b > 0 && d > 0) {
    if (isNaN(vk)) {
      var resultado = document.getElementById("resultadoCortante");
      resultado.innerHTML = "</br> Digite o valor da Força Cortante </br>";
    } else {
      vk = Math.abs(vk);
      if (fck > 50) {
        fctm = 2.12 * Math.log(1 + 0.11 * fck);
      } else {
        fctm = 0.3 * Math.cbrt(fck * fck);
      }
      fywk = fyk;
      rowMin = (100 * (0.2 * fctm)) / fywk;
      aswMin = rowMin * b * 100;
      if (modelo == 1) {
        dimensionamentoCortanteModelo1();
      } else {
        dimensionamentoCortanteModelo2();
      }
    }
  } else {
    var resultado = document.getElementById("resultadoCortante");
    resultado.innerHTML = "</br> digite todos os dados geométricos </br>";
  }
}
function entradaDeDados() {
  var classeConcreto = document.getElementById("concreto");
  //fck em MPa
  fck = parseFloat(classeConcreto.value);
  //fyk em MPa
  var tipoDeAco = document.getElementById("aco");
  fyk = parseFloat(tipoDeAco.value);
  // b, d e d' (d1) em m
  var largura = document.getElementById("b");
  b = parseFloat(largura.value) / 100;

  var alturaUtil = document.getElementById("d");
  d = parseFloat(alturaUtil.value) / 100;

  //Força cortante em MN
  var forcaCortante = document.getElementById("vk");
  vk = parseFloat(forcaCortante.value) / 1000;
}
function dimensionamentoCortanteModelo1() {
  var alphav2 = 1 - fck / 250;

  // verificar o calculo de Vrd2
  vRd2 = 0.27 * alphav2 * (fck / 1.4) * b * d;

  if (vk * 1.4 > vRd2) {
    var resultado = document.getElementById("resultadoCortante");
    resultado.innerHTML =
      "</br> A força cortante está muito alta, altere a geometria </br>";
  } else {
    vsw = vk * 1.4 - (0.6 * 0.7 * fctm * b * d) / 1.4;
    var alphaEstribos = document.getElementById("alpha");
    var alphaRad = parseFloat(alphaEstribos.value * Math.PI) / 180;
    var alphaDeg = parseFloat(alphaEstribos.value);
    if (alphaDeg < 45 || alphaDeg > 90) {
      var resultado = document.getElementById("resultadoCortante");
      resultado.innerHTML =
        "</br> Corrija os dados da 'geometria interna' </br>";
      return;
    }

    var asw =
      (vsw * 10000) /
      ((0.9 * d * fyk * (Math.sin(alphaRad) + Math.cos(alphaRad))) / 1.15);
    //impressão de resultados
    var resultado = document.getElementById("resultadoCortante");
    resultado.innerHTML =
      "</br> <h2> Resultados </h2>" +
      "<b>Asw/s= " +
      asw.toFixed(2) +
      "cm²/m" +
      "</br>Asw<sub>Min</sub> = " +
      aswMin.toFixed(2) +
      "cm²/m </br>" +
      "&rho;" +
      "<sub>Min</sub>" +
      "(taxa mínima de armadura) = " +
      rowMin.toFixed(3) +
      "%";
  }
}
function dimensionamentoCortanteModelo2() {
  // verificar se Vd < VRd2
  var alphav2 = 1 - fck / 250;
  var alphaEstribos = document.getElementById("alpha");
  var alphaRad = parseFloat(alphaEstribos.value * Math.PI) / 180;
  var thetaConcreto = document.getElementById("theta");
  var thetaRad = parseFloat(thetaConcreto.value * Math.PI) / 180;
  var alphaDeg = parseFloat(alphaEstribos.value);
  var thetaDeg = parseFloat(thetaConcreto.value);
  if (alphaDeg < 45 || alphaDeg > 90 || thetaDeg < 30 || thetaDeg > 45) {
    var resultado = document.getElementById("resultadoCortante");
    resultado.innerHTML = "</br> Corrija os dados da 'geometria interna' </br>";
    return;
  }
  // Cálculo de VRd2
  var vRd2 =
    0.54 *
    alphav2 *
    (fck / 1.4) *
    b *
    d *
    Math.sin(thetaRad) *
    Math.sin(thetaRad) *
    (1 / Math.tan(alphaRad) + 1 / Math.tan(thetaRad));

  if (vk * 1.4 > vRd2) {
    var resultado = document.getElementById("resultadoCortante");
    resultado.innerHTML =
      "</br> A força cortante está muito alta, altere a geometria </br>";
  } else {
    //// calcular Vc0, Vc1 etc
    var vc0 = (0.6 * 0.7 * fctm * b * d) / 1.4;
    var vsd = vk * 1.4;
    var vc1 = vc0;
    if (vsd > vc0) {
      vc1 = ((vRd2 - vsd) / (vRd2 - vc0)) * vc0;
    }
    vsw = vk * 1.4 - vc1;
    // var alphaestribos = document.getElementById("alpha");
    // var alpharad = parseFloat(alphaestribos.value * Math.PI) / 180;
    var asw =
      (vsw * 10000) /
      ((0.9 *
        d *
        fyk *
        Math.sin(alphaRad) *
        (1 / Math.tan(alphaRad) + 1 / Math.tan(thetaRad))) /
        1.15);
    //impressão de resultados
    var resultado = document.getElementById("resultadoCortante");
    resultado.innerHTML =
      "</br> <h2> Resultados </h2>" +
      "<b>Asw/s= " +
      asw.toFixed(2) +
      "cm²/m" +
      "</br>Asw<sub>Min</sub> = " +
      aswMin.toFixed(2) +
      "cm²/m </br>" +
      "&rho;" +
      "<sub>Min</sub>" +
      "(taxa mínima de armadura) = " +
      rowMin.toFixed(3) +
      "%";
  }
}