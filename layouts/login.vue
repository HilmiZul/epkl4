<template>
  <div class="container">
    <Header />

    <slot />

    <div class="row">
      <div class="col-3">
        <Footer />
      </div>
    </div>
  </div>
</template>

<style >
@font-face {
  font-family: 'Romana BT';
  src: url('~/assets/font/RomanaB.ttf');
}
@font-face {
  font-family: 'Metropolis';
  src: url('~/assets/font/Metropolis-Regular.otf');
}
html, body {
  background-color: #f5fff2;
  font-family: 'Metropolis';
}
.metropolis {
  font-family: 'Metropolis';
}
.romana {
  font-family: 'Romana BT';
}
.shadow-lg {
  box-shadow: 0.5rem 0.5rem 0 #000000 !important;
}
.card {
  border-radius: 0 !important;
  border: 1.9px solid #000000;
  box-shadow: 0.5rem 0.5rem 0 #000000 !important;
}
.btn {
  transition: all 0.2s ease-in-out;
  border: 1.9px solid #000000;
  border-radius: 0 !important;
  box-shadow: 0.2rem 0.2rem 0 #000000 !important;
}
.btn:hover {
  transform: scale(0.97);
  border: 1.9px solid #000000;
  box-shadow: 0.1rem 0.1rem 0 #000000 !important;
}
.btn:disabled {
  border: 1.9px solid #000000;
  box-shadow: none !important;
}
.form {
  border: 1.9px solid #000000;
  border-radius: 0 !important;
  box-shadow: 0.2rem 0.2rem 0 #000000 !important;
}
.form:focus {
  border-color: #000000;
}
button.btn-grey {
  background-color: #c1ccd5;
  border: none;
  color: #212c30;
}
button.btn-grey:hover {
  color: #f5fff2;
  background-color: #212c30;
}
</style>
