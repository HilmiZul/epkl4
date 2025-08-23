<template>
  <div>
    <slot />
  </div>
</template>

<style>
body {
  background: rgb(204,204,204);
  font-family: Arial, Helvetica, sans-serif;
}
page {
  background: white;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  /*box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);*/
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
}
</style>
