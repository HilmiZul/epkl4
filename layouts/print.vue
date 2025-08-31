<template>
  <div>
    <slot />
  </div>
</template>

<style>
/*body {
  background: rgb(204,204,204);
  font-family: Arial, Helvetica, sans-serif;
}
page {
  background: white;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
}
page[size="A4"] {
  width: 21cm;
  height: 29.7cm;
}
page[size="A4"][layout="portrait"] {
  width: 29.7cm;
  height: 21cm;
}
@media print {
  body, page {
    margin: 0.5cm;
    box-shadow: 0;
  }
}*/

body {
  margin: 0;
  font-size: 12pt;
  font-family: 'Times New Roman', Times, serif;
}
.base {
  margin: 0;
}
.kertas {
  margin: 0;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  page-break-after: auto;
}

@media screen {
  body {
    background: #e0e0e0
  }
  .kertas {
    background: white;
    box-shadow: 0 .5mm 2mm rgba(0,0,0,.3);
    margin: 5mm auto;
  }
}

.base.F4 .kertas {
  width: 210mm;
  height: 330mm;
  padding: 17mm;
}
/*.kertas.padding-5mm { padding: 5mm }*/

@page {
  width: 210mm;
  height: 330mm;
  margin: 0
}
/*@media print {
  .base.F4, .base.F4.landscape {
    width: 330mm
  }
}*/

.text-center {
  text-align: center;
}

table {
  width: 90%;
  line-height: 4.5mm;
}
table.table {
  border-collapse: collapse;;
}
table.table tr, table.table td {
  border: 1px solid;
}
table.lineheigh {
  line-height: 25px;
}

h1, h2, h3, h4, h5, h6, address {
  padding: 0;
  margin: 0;
}
.bold {
  font-weight: bold;
}
.italic {
  font-style: italic;
}
p {
  font-size: 11pt;
  line-height: 4.7mm;
  text-align: justify !important;
}
.small {
  font-size: 11pt !important;
}

.logo {
  width: 100px;
}

.garis {
  border: 2px solid #000
}
.mt-2 {
  margin-top: 20px;
}
.mt-3 {
  margin-top: 30px;
}
.mt-4 {
  margin-top: 40px;
}
.mt-5 {
  margin-top: 50px;
}
p, ol, li {
  margin: 0 !important;
  line-height: 4.7mm;
}
.underline {
  border-bottom: 1px solid;
}
</style>
